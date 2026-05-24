from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.interview import router as interview_router

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "HireIQ running"}

app.include_router(interview_router, prefix="/interview")
