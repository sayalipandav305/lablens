from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from database.models import Report, MedicalProfile, User
from services.auth import get_current_user

router = APIRouter()


@router.get("/medical-history")
def get_medical_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # Get medical profile
    profile = (
        db.query(MedicalProfile)
        .filter(
            MedicalProfile.user_id == current_user.id
        )
        .first()
    )

    # Get all reports belonging to logged-in user
    reports = (
        db.query(Report)
        .filter(
            Report.user_id == current_user.id
        )
        .order_by(
            Report.upload_date.desc()
        )
        .all()
    )

    total_reports = len(reports)

    normal_parameters = 0
    abnormal_parameters = 0

    for report in reports:

        analysis = report.analysis_json or []

        for test in analysis:

            status = test.get("status", "")

            if status == "Normal":
                normal_parameters += 1

            elif status in ["High", "Low"]:
                abnormal_parameters += 1

    latest_health_score = (
        reports[0].health_score
        if reports
        else 0
    )

    report_data = []

    for report in reports:

        analysis = report.analysis_json or []

        report_data.append({
            "id": report.id,
            "filename": report.filename,
            "upload_date": report.upload_date,
            "health_score": report.health_score,
            "summary": report.summary or [],
            "analysis_json": analysis
        })

    return {
        "profile": {
            "blood_group": profile.blood_group if profile else None,
            "height": profile.height if profile else None,
            "weight": profile.weight if profile else None,
            "activity_level": profile.activity_level if profile else None,
            "medical_conditions": (
                profile.medical_conditions
                if profile
                else []
            ),
            "family_history": (
                profile.family_history
                if profile
                else []
            ),
            "allergies": (
                profile.allergies
                if profile
                else []
            ),
            "medications": (
                profile.medications
                if profile
                else []
            ),
            "health_goals": (
                profile.health_goals
                if profile
                else []
            )
        },

        "statistics": {
            "total_reports": total_reports,
            "normal_parameters": normal_parameters,
            "abnormal_parameters": abnormal_parameters,
            "health_score": latest_health_score
        },

        "reports": report_data
    }