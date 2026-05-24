from pydantic import BaseModel

class GenerateRequest(BaseModel):
    topic: str

class AnswerRequest(BaseModel):
    answer: str