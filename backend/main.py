"""
KEAM Mock Test — FastAPI Backend
=================================
Run with:
    pip install fastapi uvicorn[standard] sqlalchemy psycopg2-binary pydantic python-jose[cryptography] passlib[bcrypt]
    uvicorn backend.main:app --reload --port 8000

PostgreSQL setup (optional, uses SQLite by default for local dev):
    Set DATABASE_URL env variable to your PostgreSQL URL:
    export DATABASE_URL="postgresql://user:password@localhost/keam_db"
"""

from __future__ import annotations

import os
import uuid
from datetime import datetime
from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import (
    Column, String, Integer, DateTime, JSON, Boolean, Float, create_engine, ForeignKey
)
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# ─── Database Setup ───────────────────────────────────────────────────
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./keam_mock.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ─── Database Models ──────────────────────────────────────────────────
class DBStudent(Base):
    __tablename__ = "students"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    roll_no = Column(String, unique=True, nullable=False)
    application_no = Column(String, unique=True, nullable=False)
    exam_center = Column(String)
    dob = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class DBExamSession(Base):
    __tablename__ = "exam_sessions"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    roll_no = Column(String, nullable=False)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    answers = Column(JSON, default={})           # {questionId: optionIdx}
    marked_for_review = Column(JSON, default=[]) # [questionId]
    visited = Column(JSON, default=[])           # [questionId]
    is_submitted = Column(Boolean, default=False)
    # Score summary (computed on submit)
    total_score = Column(Integer, nullable=True)
    correct_count = Column(Integer, nullable=True)
    wrong_count = Column(Integer, nullable=True)
    unattempted_count = Column(Integer, nullable=True)
    time_taken_seconds = Column(Integer, nullable=True)
    math_score = Column(Integer, nullable=True)
    physics_score = Column(Integer, nullable=True)
    chemistry_score = Column(Integer, nullable=True)


Base.metadata.create_all(bind=engine)


# ─── Pydantic Schemas ─────────────────────────────────────────────────
class StudentCreate(BaseModel):
    name: str
    roll_no: str
    application_no: str
    exam_center: Optional[str] = ""
    dob: str


class SessionStartResponse(BaseModel):
    session_id: str
    student_id: str
    message: str


class SaveProgressRequest(BaseModel):
    session_id: str
    answers: Dict[str, int]
    marked_for_review: List[str]
    visited: List[str]


class SubmitRequest(BaseModel):
    session_id: str
    answers: Dict[str, int]
    marked_for_review: List[str]
    visited: List[str]
    time_taken_seconds: int


class ScoreBreakdown(BaseModel):
    subject: str
    total: int
    correct: int
    wrong: int
    unattempted: int
    score: int
    max_score: int


class SubmitResponse(BaseModel):
    session_id: str
    roll_no: str
    total_score: int
    max_score: int
    correct: int
    wrong: int
    unattempted: int
    percentage: float
    time_taken_seconds: int
    breakdown: List[ScoreBreakdown]


class LeaderboardEntry(BaseModel):
    rank: int
    name: str
    roll_no: str
    total_score: int
    correct: int
    wrong: int
    percentage: float
    time_taken_seconds: int


# ─── Questions Data (same as frontend) ───────────────────────────────
# In production, store in DB. Here we keep a minimal reference.
QUESTIONS_META = {
    # Mathematics: Q1-Q75
    **{f'm{i}': {'subject': 'Mathematics', 'correct': 0} for i in range(1, 76)},
    # Physics: Q76-Q120
    **{f'p{i}': {'subject': 'Physics', 'correct': 0} for i in range(1, 46)},
    # Chemistry: Q121-Q150
    **{f'c{i}': {'subject': 'Chemistry', 'correct': 0} for i in range(1, 31)},
}

# Correct answers map (matching mockQuestions.ts correctOption values)
CORRECT_ANSWERS: Dict[str, int] = {
    'm1': 2, 'm2': 1, 'm3': 2, 'm4': 2, 'm5': 2, 'm6': 1, 'm7': 2, 'm8': 0,
    'm9': 1, 'm10': 2, 'm11': 2, 'm12': 1, 'm13': 2, 'm14': 2, 'm15': 0,
    'm16': 0, 'm17': 1, 'm18': 2, 'm19': 1, 'm20': 1, 'm21': 2, 'm22': 0,
    'm23': 2, 'm24': 0, 'm25': 0, 'm26': 0, 'm27': 1, 'm28': 0, 'm29': 2,
    'm30': 3, 'm31': 3, 'm32': 1, 'm33': 2, 'm34': 2, 'm35': 0, 'm36': 2,
    'm37': 1, 'm38': 2, 'm39': 1, 'm40': 2, 'm41': 1, 'm42': 2, 'm43': 2,
    'm44': 3, 'm45': 0, 'm46': 4, 'm47': 2, 'm48': 2, 'm49': 3, 'm50': 2,
    'm51': 2, 'm52': 4, 'm53': 2, 'm54': 1, 'm55': 2, 'm56': 0, 'm57': 1,
    'm58': 0, 'm59': 1, 'm60': 3, 'm61': 1, 'm62': 1, 'm63': 2, 'm64': 3,
    'm65': 0, 'm66': 0, 'm67': 1, 'm68': 2, 'm69': 1, 'm70': 3, 'm71': 2,
    'm72': 1, 'm73': 0, 'm74': 1, 'm75': 2,
    'p1': 1, 'p2': 1, 'p3': 1, 'p4': 1, 'p5': 1, 'p6': 2, 'p7': 1, 'p8': 1,
    'p9': 2, 'p10': 1, 'p11': 2, 'p12': 2, 'p13': 0, 'p14': 1, 'p15': 2,
    'p16': 2, 'p17': 2, 'p18': 1, 'p19': 1, 'p20': 3, 'p21': 2, 'p22': 3,
    'p23': 1, 'p24': 3, 'p25': 2, 'p26': 2, 'p27': 2, 'p28': 1, 'p29': 2,
    'p30': 2, 'p31': 2, 'p32': 2, 'p33': 2, 'p34': 1, 'p35': 0, 'p36': 2,
    'p37': 2, 'p38': 1, 'p39': 3, 'p40': 1, 'p41': 1, 'p42': 2, 'p43': 2,
    'p44': 2, 'p45': 2,
    'c1': 2, 'c2': 1, 'c3': 3, 'c4': 3, 'c5': 2, 'c6': 1, 'c7': 2, 'c8': 1,
    'c9': 2, 'c10': 2, 'c11': 2, 'c12': 2, 'c13': 1, 'c14': 2, 'c15': 3,
    'c16': 1, 'c17': 1, 'c18': 2, 'c19': 2, 'c20': 2, 'c21': 1, 'c22': 0,
    'c23': 3, 'c24': 1, 'c25': 2, 'c26': 2, 'c27': 2, 'c28': 3, 'c29': 1,
    'c30': 2,
}

SUBJECT_QUESTION_IDS = {
    'Mathematics': [f'm{i}' for i in range(1, 76)],
    'Physics': [f'p{i}' for i in range(1, 46)],
    'Chemistry': [f'c{i}' for i in range(1, 31)],
}


def calculate_score(answers: Dict[str, int]) -> dict:
    """Calculate scores using KEAM marking scheme: +4 correct, -1 wrong"""
    results = {}
    for subject, qids in SUBJECT_QUESTION_IDS.items():
        correct = wrong = unattempted = score = 0
        for qid in qids:
            ans = answers.get(qid)
            correct_ans = CORRECT_ANSWERS.get(qid)
            if ans is None:
                unattempted += 1
            elif ans == correct_ans:
                correct += 1
                score += 4
            else:
                wrong += 1
                score -= 1
        results[subject] = {
            'correct': correct, 'wrong': wrong,
            'unattempted': unattempted, 'score': score,
            'total': len(qids), 'max_score': len(qids) * 4
        }
    return results


# ─── FastAPI App ──────────────────────────────────────────────────────
app = FastAPI(
    title="KEAM Mock Test API",
    description="Backend API for KEAM 2025 Mock Test Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # In production, set to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ─── API Endpoints ────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "KEAM 2025 Mock Test API is running", "docs": "/docs"}


@app.post("/api/student/register", response_model=SessionStartResponse)
def register_and_start(student: StudentCreate, db: Session = Depends(get_db)):
    """Register student and start an exam session."""
    # Upsert student
    db_student = db.query(DBStudent).filter(
        DBStudent.roll_no == student.roll_no
    ).first()

    if not db_student:
        db_student = DBStudent(
            name=student.name,
            roll_no=student.roll_no,
            application_no=student.application_no,
            exam_center=student.exam_center,
            dob=student.dob,
        )
        db.add(db_student)
        db.commit()
        db.refresh(db_student)

    # Check if already has an ongoing session
    existing = db.query(DBExamSession).filter(
        DBExamSession.student_id == db_student.id,
        DBExamSession.is_submitted == False
    ).first()

    if existing:
        return SessionStartResponse(
            session_id=existing.id,
            student_id=db_student.id,
            message="Resuming existing session"
        )

    # Create new session
    session = DBExamSession(
        student_id=db_student.id,
        roll_no=student.roll_no,
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    return SessionStartResponse(
        session_id=session.id,
        student_id=db_student.id,
        message="New exam session started"
    )


@app.post("/api/session/save")
def save_progress(req: SaveProgressRequest, db: Session = Depends(get_db)):
    """Auto-save student's progress during exam."""
    session = db.query(DBExamSession).filter(
        DBExamSession.id == req.session_id,
        DBExamSession.is_submitted == False
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found or already submitted")

    session.answers = req.answers
    session.marked_for_review = req.marked_for_review
    session.visited = req.visited
    db.commit()

    return {"status": "saved", "timestamp": datetime.utcnow().isoformat()}


@app.post("/api/session/submit", response_model=SubmitResponse)
def submit_exam(req: SubmitRequest, db: Session = Depends(get_db)):
    """Submit the exam and calculate scores."""
    session = db.query(DBExamSession).filter(
        DBExamSession.id == req.session_id,
        DBExamSession.is_submitted == False
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found or already submitted")

    # Calculate scores
    score_data = calculate_score(req.answers)
    total_score = sum(s['score'] for s in score_data.values())
    total_correct = sum(s['correct'] for s in score_data.values())
    total_wrong = sum(s['wrong'] for s in score_data.values())
    total_unattempted = sum(s['unattempted'] for s in score_data.values())
    max_score = 150 * 4

    # Update session
    session.answers = req.answers
    session.marked_for_review = req.marked_for_review
    session.visited = req.visited
    session.is_submitted = True
    session.end_time = datetime.utcnow()
    session.time_taken_seconds = req.time_taken_seconds
    session.total_score = total_score
    session.correct_count = total_correct
    session.wrong_count = total_wrong
    session.unattempted_count = total_unattempted
    session.math_score = score_data['Mathematics']['score']
    session.physics_score = score_data['Physics']['score']
    session.chemistry_score = score_data['Chemistry']['score']
    db.commit()

    breakdown = [
        ScoreBreakdown(
            subject=subj,
            total=data['total'],
            correct=data['correct'],
            wrong=data['wrong'],
            unattempted=data['unattempted'],
            score=data['score'],
            max_score=data['max_score']
        )
        for subj, data in score_data.items()
    ]

    return SubmitResponse(
        session_id=session.id,
        roll_no=session.roll_no,
        total_score=total_score,
        max_score=max_score,
        correct=total_correct,
        wrong=total_wrong,
        unattempted=total_unattempted,
        percentage=round((total_score / max_score) * 100, 2),
        time_taken_seconds=req.time_taken_seconds,
        breakdown=breakdown
    )


@app.get("/api/results/{session_id}", response_model=SubmitResponse)
def get_result(session_id: str, db: Session = Depends(get_db)):
    """Get exam result for a submitted session."""
    session = db.query(DBExamSession).filter(
        DBExamSession.id == session_id,
        DBExamSession.is_submitted == True
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Result not found")

    score_data = calculate_score(session.answers or {})
    breakdown = [
        ScoreBreakdown(
            subject=subj,
            total=data['total'],
            correct=data['correct'],
            wrong=data['wrong'],
            unattempted=data['unattempted'],
            score=data['score'],
            max_score=data['max_score']
        )
        for subj, data in score_data.items()
    ]

    return SubmitResponse(
        session_id=session.id,
        roll_no=session.roll_no,
        total_score=session.total_score or 0,
        max_score=150 * 4,
        correct=session.correct_count or 0,
        wrong=session.wrong_count or 0,
        unattempted=session.unattempted_count or 0,
        percentage=round(((session.total_score or 0) / (150 * 4)) * 100, 2),
        time_taken_seconds=session.time_taken_seconds or 0,
        breakdown=breakdown
    )


@app.get("/api/leaderboard", response_model=List[LeaderboardEntry])
def get_leaderboard(limit: int = 50, db: Session = Depends(get_db)):
    """Get top performers leaderboard."""
    sessions = db.query(DBExamSession).filter(
        DBExamSession.is_submitted == True
    ).order_by(
        DBExamSession.total_score.desc(),
        DBExamSession.time_taken_seconds.asc()
    ).limit(limit).all()

    result = []
    for rank, s in enumerate(sessions, 1):
        student = db.query(DBStudent).filter(DBStudent.id == s.student_id).first()
        result.append(LeaderboardEntry(
            rank=rank,
            name=student.name if student else "Unknown",
            roll_no=s.roll_no,
            total_score=s.total_score or 0,
            correct=s.correct_count or 0,
            wrong=s.wrong_count or 0,
            percentage=round(((s.total_score or 0) / (150 * 4)) * 100, 2),
            time_taken_seconds=s.time_taken_seconds or 0,
        ))
    return result


@app.get("/api/admin/stats")
def get_stats(db: Session = Depends(get_db)):
    """Admin endpoint: overall exam statistics."""
    total_students = db.query(DBStudent).count()
    total_sessions = db.query(DBExamSession).count()
    completed_sessions = db.query(DBExamSession).filter(
        DBExamSession.is_submitted == True
    ).count()

    all_scores = db.query(DBExamSession.total_score).filter(
        DBExamSession.is_submitted == True,
        DBExamSession.total_score.isnot(None)
    ).all()

    scores = [s[0] for s in all_scores]
    avg_score = round(sum(scores) / len(scores), 2) if scores else 0
    highest = max(scores) if scores else 0
    lowest = min(scores) if scores else 0

    return {
        "total_students_registered": total_students,
        "total_sessions": total_sessions,
        "completed_sessions": completed_sessions,
        "ongoing_sessions": total_sessions - completed_sessions,
        "average_score": avg_score,
        "highest_score": highest,
        "lowest_score": lowest,
        "max_possible_score": 600,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
