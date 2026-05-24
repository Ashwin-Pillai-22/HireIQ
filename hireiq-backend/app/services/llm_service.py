from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from app.core.config import MODEL_NAME

llm = OllamaLLM(
    model=MODEL_NAME,
    temperature=0.7,
    top_p=0.9
)

parser = JsonOutputParser()

question_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a technical interviewer."),
        ("user", """
            Generate EXACTLY 20 UNIQUE interview questions about {topic}.
            Ensure each question is distinct and not repeated.
            Avoid repeating common textbook questions.
            Vary difficulty levels and question style.
            Return EXACT JSON only, with this structure:
            {{
                "questions": [
                    {{"id": 1, "question": ""}}
                ]
            }}
            Do not add explanations or extra fields.
            Use id values from 1 to 20.
            """
        )
    ]
)


def _normalize_question_text(question: str) -> str:
    return " ".join(question.strip().lower().split())


def _dedupe_questions(questions: list[dict]) -> list[dict]:
    seen = set()
    unique_questions = []

    for item in questions:
        question_text = str(item.get("question", "")).strip()
        normalized = _normalize_question_text(question_text)
        if not normalized or normalized in seen:
            continue

        seen.add(normalized)
        unique_questions.append(item)

    return unique_questions


def generate_questions(topic: str):
    chain = question_prompt | llm | parser
    result = chain.invoke({"topic": topic})
    questions = result.get("questions", []) if isinstance(result, dict) else []
    unique_questions = _dedupe_questions(questions)
    if len(unique_questions) != len(questions):
        result["questions"] = unique_questions
    return result

scoring_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert technical interviewer."),
    ("human", """
        Question:
        {question}

        Candidate Answer:
        {answer}

        Evaluate the answer based on:
        - correctness
        - completeness
        - clarity

        Score the answer from 0 to 10.

        Return ONLY valid JSON:

        {{
        "score": number,
        "feedback": "short explanation"
        }}
    """)
])
def score_answers(question:str, answer:str):
    chain = scoring_prompt | llm | parser
    return chain.invoke({"question": question, "answer": answer})
