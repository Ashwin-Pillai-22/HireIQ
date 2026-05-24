from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Header
from app.models.schemas import GenerateRequest, AnswerRequest
from app.services.interview_service import create_interview, sessions
from app.services.llm_service import score_answers
from app.core.security import verify_api_key, verify_api_key_readonly, verify_authenticated_user, verify_authenticated_user_readonly
from app.db.firestore import db
from datetime import datetime

router = APIRouter()

def score_answer(session_id, question_id):
    interview_ref = db.collection("interviews").document(session_id)

    question_doc = interview_ref.collection("questions").document(question_id).get()

    question = question_doc.get("questionText")
    answer = question_doc.get("answerText")

    result = score_answers(question, answer)    

    # store result
    interview_ref.collection("questions").document(question_id).update({
        "feedback": result["feedback"],
        "score": result["score"]
    })



@router.post("/start")
def start_interview(request: GenerateRequest,
                    auth_result: str = Depends(verify_authenticated_user),
                    x_user_id: str = Header(None)):

    session_id = create_interview(x_user_id, request.topic)

    interview_doc = db.collection("interviews").document(session_id).get()
    interview_data = interview_doc.to_dict() or {}
    doc = db.collection("interviews").document(session_id).collection("questions").document("q01").get()
    question = doc.to_dict()["questionText"]

    return {
        "session_id": session_id,
        "question": question,
        "total_questions": interview_data.get("totalQuestions", 20)
    }

@router.post("/interviews/{session_id}/answer")
def submit_answer(session_id: str, request: AnswerRequest, background_task: BackgroundTasks):
    session = sessions.get(session_id)

    interview_ref = db.collection("interviews").document(session_id)
    interview_doc = interview_ref.get()

    # Validate interview
    if not interview_doc.exists:
        raise HTTPException(status_code=404, detail="Interview not found")

    interview_data = interview_doc.to_dict()

    # Check status
    if interview_data["status"] != "ongoing":
        raise HTTPException(status_code=400, detail="Interview already completed")

    try:
        current_index = session["current_index"] + 1
    except:
        session["current_index"] = 0
        current_index = session["current_index"]

    # if current_index < 0:
    #     raise HTTPException(status_code=400, detail="No question has been served yet")

    # Identify current question
    qid = f"q{str(current_index + 1).zfill(2)}"
    question_ref = interview_ref.collection("questions").document(qid)
    question_doc = question_ref.get()

    if not question_doc.exists:
        raise HTTPException(status_code=400, detail="Question not found")

    # Save answer
    question_ref.update({
        "answerText": request.answer,
        "answeredAt": datetime.utcnow()
    })

    # Background task for scoring the User answers
    background_task.add_task(score_answer,session_id, qid)
    
    # Move to next question
    next_index = current_index + 1
    total_questions = interview_data.get("totalQuestions", 20)

    # If interview finished
    if next_index >= total_questions:

        interview_ref.update({
            "status": "completed",
            "completedAt": datetime.utcnow()
        })

        return {
            "message": "Interview completed successfully.",
            "completed": True
        }

    # Update currentIndex
    interview_ref.update({
        "currentIndex": next_index
    })

    # Fetch next question
    next_qid = f"q{str(next_index + 1).zfill(2)}"
    next_question_doc = interview_ref.collection("questions").document(next_qid).get()

    if not next_question_doc.exists:
        raise HTTPException(status_code=500, detail="Next question missing")

    next_question_data = next_question_doc.to_dict()

    session["current_index"] = current_index
    
    return {
        "message": "Answer saved successfully.",
        "completed": False,
        "nextQuestion": {
            "questionId": next_qid,
            "questionText": next_question_data["questionText"],
            "order": next_question_data["order"]
        },
        "progress": f"{next_index + 1}/{total_questions}"
    }

@router.get("/interviews/{session_id}/result")
def calculate_result(session_id: str):

    question_ref = db.collection("interviews").document(session_id).collection("questions")
    questions = question_ref.get()

    total_score = 0
    count = 0
    total_questions = len(questions)

    for doc in questions:
        data = doc.to_dict()
        # Check if question has an answer (was attempted)
        if "answerText" in data and data["answerText"].strip():
            try:
                score = data.get("score")
                if score is not None:
                    total_score += score
                    count += 1
            except:
                pass

    final_score = total_score / count if count else 0

    return {
        "questions_scored": count,
        "total_questions": total_questions,
        "average_score": final_score,
        "all_scored": count == total_questions
    }

@router.get("/interviews/{session_id}/questions/{question_id}")
def get_question_feedback(session_id: str, question_id: str, auth_result: str = Depends(verify_authenticated_user_readonly)):
    question_ref = db.collection("interviews").document(session_id).collection("questions").document(question_id)
    question_doc = question_ref.get()

    if not question_doc.exists:
        raise HTTPException(status_code=404, detail="Question not found")

    data = question_doc.to_dict()
    return {
        "questionId": question_id,
        "questionText": data.get("questionText", ""),
        "answerText": data.get("answerText", ""),
        "feedback": data.get("feedback", ""),
        "score": data.get("score", 0),
        "order": data.get("order", 0)
    }