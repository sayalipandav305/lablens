from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from database.models import MedicalProfile, User
from database.schemas import (
    MedicalProfileCreate,
    MedicalProfileResponse,
)
from services.auth import get_current_user

router = APIRouter()

@router.get(
    "/profile",
    response_model=MedicalProfileResponse
)
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    profile = db.query(MedicalProfile).filter(
        MedicalProfile.user_id == current_user.id
    ).first()

    if not profile:
     profile = MedicalProfile(
        user_id=current_user.id,
        medical_conditions=[],
        family_history=[],
        allergies=[],
        medications=[],
        health_goals=[]
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

# Fix existing NULL values
    profile.medical_conditions = profile.medical_conditions or []
    profile.family_history = profile.family_history or []
    profile.allergies = profile.allergies or []
    profile.medications = profile.medications or []
    profile.health_goals = profile.health_goals or []

    
    return profile 

@router.put(
    "/profile",
    response_model=MedicalProfileResponse
)
def update_profile(
    profile_data: MedicalProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    profile = db.query(MedicalProfile).filter(
        MedicalProfile.user_id == current_user.id
    ).first()

    if not profile:
        profile = MedicalProfile(
            user_id=current_user.id
        )
        db.add(profile)

    for key, value in profile_data.model_dump().items():
        setattr(profile, key, value)

    db.commit()
    db.refresh(profile)

    return profile