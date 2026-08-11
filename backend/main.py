from fastapi import FastAPI, UploadFile, File,Depends
from fastapi.middleware.cors import CORSMiddleware
from database.database import Base, engine
from services.parser import extract_text
from services.gemini_extractor import extract_medical_data
from services.analyzer import analyze_tests
from routes.auth import router as auth_router,get_current_user
from database.models import User, Report
from database.database import get_db
from routes.profile import router as profile_router
from sqlalchemy.orm import Session
from routes.user_profile import router as user_profile_router
from routes.auth import router as auth_router
from routes.medical_history import router as medical_history_router
from fastapi import HTTPException
from fastapi.staticfiles import StaticFiles


import database.models
import shutil
import os

app = FastAPI()

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(medical_history_router)
app.include_router(user_profile_router)

Base.metadata.create_all(bind=engine)
# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads folder if it doesn't exist
os.makedirs("uploads", exist_ok=True)


# Create profile image folder
os.makedirs("uploads/profile_images", exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)


@app.get("/")
def home():
    return {
        "message": "LabLens Backend Running"
    }


@app.post("/upload")
async def upload_report(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # Save uploaded file
    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text from PDF
    extracted_text = extract_text(file_path)

    # Extract medical parameters using Gemini
    parameters = extract_medical_data(extracted_text)

    print("\n===== GEMINI OUTPUT =====")
    print(parameters)

    print("\n===== TEST COUNT =====")
    print(len(parameters.get("tests", [])))

    if "error" in parameters:
     return {
        "error": parameters["error"]
    }

    # Analyze test results

    
    analyzed_tests = analyze_tests(parameters["tests"])

    # Generate Health Summary
    high_count = 0
    low_count = 0
    normal_count = 0

    summary = []

    for test in analyzed_tests:

        status = test.get("status", "")

        if status == "High":
            high_count += 1
            summary.append(
                f"{test['name']} is above normal."
            )

        elif status == "Low":
            low_count += 1
            summary.append(
                f"{test['name']} is below normal."
            )

        elif status == "Normal":
            normal_count += 1

    # Calculate Health Score
    health_score = max(
        0,
        100 - ((high_count + low_count) * 10)
    )

    # Add overall insights
    summary.append(
        f"{normal_count} parameters are within normal range."
    )

    summary.append(
        f"{high_count + low_count} parameters require attention."
    )
    
    new_report = Report(
     filename=file.filename,
     health_score=health_score,
     summary=summary,
     analysis_json=analyzed_tests,
     user_id=current_user.id
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return {
    "id": new_report.id,
    "filename": new_report.filename,
    "upload_date": new_report.upload_date,
    "health_score": new_report.health_score,
    "summary": new_report.summary,
    "analysis_json": new_report.analysis_json,
    "tests": new_report.analysis_json
}

@app.get("/reports")
def get_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    reports = (
        db.query(Report)
        .filter(Report.user_id == current_user.id)
        .order_by(Report.upload_date.desc())
        .all()
    )

    return [
        {
            "id": report.id,
            "filename": report.filename,
            "upload_date": report.upload_date,
            "health_score": report.health_score,
            "summary": report.summary,
            "analysis_json": report.analysis_json,
        }
        for report in reports
    ]

@app.delete("/reports/{report_id}")
def delete_report(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    report = (
        db.query(Report)
        .filter(
            Report.id == report_id,
            Report.user_id == current_user.id
        )
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    db.delete(report)
    db.commit()

    return {
        "message": "Report deleted successfully",
        "report_id": report_id
    }