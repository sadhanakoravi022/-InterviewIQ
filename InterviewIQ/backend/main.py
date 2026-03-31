import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from typing import List
import json
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="AI Interview Practice API")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "healthy"}

# API Key and Client configuration
API_KEY = "YOUR_API_KEY"
MODEL = "MODEL_NAME"  # Free, fast Groq model

SIMPLE_QUESTIONS = [
    "Tell me about yourself.",
    "What are your greatest strengths?",
    "What are your weaknesses and how do you work on them?",
    "Why are you interested in this role?",
    "Where do you see yourself in five years?",
    "How do you handle pressure or stressful situations?",
    "Give an example of a time you worked well in a team.",
    "What is your greatest professional achievement?",
    "Tell me about a time you made a mistake and how you handled it.",
    "How do you prioritize your work when you have multiple tasks?"
]

def get_groq_client():
    """Initializes the Groq client."""
    return Groq(api_key=API_KEY)

def chat_complete(client, model, messages):
    """Send chat completion request to Groq."""
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        response_format={"type": "json_object"}
    )
    return response.choices[0].message.content

class InterviewSession(BaseModel):
    topic: str
    difficulty: str
    previous_questions: List[str] = []

class AnswerInput(BaseModel):
    topic: str
    difficulty: str
    question: str
    answer: str
    previous_questions: List[str] = []

@app.post("/interview/start")
async def start_interview(session: InterviewSession):
    """Generates the first interview question."""
    if session.topic == "General" and not session.previous_questions:
        import random
        return {"question": random.choice(SIMPLE_QUESTIONS)}
        
    prompt = f"""
    You are a professional AI interviewer.
    Generate 1 unique interview question for a {session.topic} role.
    Difficulty Level: {session.difficulty}
    Role Context: {session.topic}
    
    Specific Rules for Difficulty:
    - Easy: Focus on basic definitions, "soft skills," or introductory concepts. If Topic is "General," ask a common behavioral question.
    - Medium: Conceptual and practical questions requiring some experience.
    - Hard: Real-world, scenario-based or complex problem-solving questions.

    General Rules:
    - Do NOT repeat any question from this list: {session.previous_questions}
    - Maintain high relevance to the topic.
    - Ensure diversity in concepts.
    - Return ONLY the question (no explanation).
    
    Return in JSON format:
    {{
      "question": "your generated unique question"
    }}
    """
    
    try:
        client = get_groq_client()
        content_str = chat_complete(client, MODEL, [{"role": "user", "content": prompt}])
        content = json.loads(content_str)
        return content
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/interview/evaluate")
async def evaluate_answer(input_data: AnswerInput):
    """Evaluates the user's answer and provides the next question."""
    prompt = f"""
    You are a professional AI interviewer.
    
    Topic: {input_data.topic}
    Difficulty: {input_data.difficulty}
    Current Question: {input_data.question}
    User's Answer: {input_data.answer}
    Previously Asked Questions: {input_data.previous_questions}

    Task 1: Evaluate the user's answer to the current question (score, feedback, correct_answer).
    Task 2: Generate 1 NEW, UNIQUE interview question that is NOT present in the previous questions list.
    Maintain diversity in concepts and stay relevant to the topic and difficulty.

    Difficulty definitions:
    - Easy: Focus on basic definitions, "soft skills," or introductory concepts. If Topic is "General," ask a common behavioral question.
    - Medium: Conceptual and practical questions requiring some experience.
    - Hard: Real-world, scenario-based or complex problem-solving questions.

    Return ONLY in JSON format:
    {{
      "next_question": "the unique next interview question",
      "evaluation": {{
        "score": number (0-10),
        "feedback": "constructive feedback on the user's answer",
        "correct_answer": "high-quality sample answer"
      }}
    }}
    """
    
    try:
        client = get_groq_client()
        content_str = chat_complete(client, MODEL, [{"role": "user", "content": prompt}])
        content = json.loads(content_str)
        return content
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Serve frontend static files - Mount last to avoid intercepting API routes
BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"
app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)
