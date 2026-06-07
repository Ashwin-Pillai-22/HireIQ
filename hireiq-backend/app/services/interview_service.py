import uuid
from datetime import datetime
from firebase_admin import firestore as fb_firestore
from app.db.firestore import db
from app.services.llm_service import generate_questions

sessions = {}

def attach_interview_to_user(user_id: str, session_id: str):
    if not user_id:
        return

    user_ref = db.collection("users").document(user_id)
    user_ref.set({
        "userId": user_id,
        "lastInterviewId": session_id,
        "interviewIds": fb_firestore.ArrayUnion([session_id]),
        "updatedAt": datetime.utcnow()
    }, merge=True)


def create_interview(user_id: str, topic: str):

    session_id = str(uuid.uuid4())
    questions = generate_questions(topic)["questions"]

    sessions[session_id] = {
        "questions": [questions],
        "current_index": -1
    }

    interview_ref = db.collection("interviews").document(session_id)

    interview_ref.set({
        "userId": user_id,
        "topic": topic,
        "status": "ongoing",
        "currentIndex": -1,
        "totalQuestions": len(questions),
        "createdAt": datetime.utcnow()
    })

    attach_interview_to_user(user_id, session_id)

    for i, q in enumerate(questions, start=1):
        qid = f"q{str(i).zfill(2)}"
        interview_ref.collection("questions").document(qid).set({
            "questionText": q["question"],
            "answerText": "",
            "score": None,
            "feedback": "",
            "order": i
        })
    

    return session_id