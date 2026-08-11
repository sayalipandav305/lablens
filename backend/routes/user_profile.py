from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException
)

from sqlalchemy.orm import Session

from database.database import get_db
from database.models import UserProfile, User
from database.schemas import (
    UserProfileCreate,
    UserProfileResponse
)
from services.auth import get_current_user

import os
import uuid


router = APIRouter()


# ============================================================
# GET USER PROFILE
# ============================================================

@router.get(
    "/user-profile",
    response_model=UserProfileResponse
)
def get_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    profile = (
        db.query(UserProfile)
        .filter(
            UserProfile.user_id == current_user.id
        )
        .first()
    )

    # Create profile if it doesn't exist
    if not profile:
        profile = UserProfile(
            user_id=current_user.id
        )

        db.add(profile)
        db.commit()
        db.refresh(profile)

    return {
        "id": profile.id,
        "user_id": profile.user_id,

        # User account information
        "email": current_user.email,

        # Personal profile
        "full_name": profile.full_name,
        "phone": profile.phone,
        "location": profile.location,
        "date_of_birth": profile.date_of_birth,
        "gender": profile.gender,
        "profile_image": profile.profile_image,

        # Notification settings
        "email_digest": profile.email_digest,
        "upload_notifications": profile.upload_notifications,
        "consultation_notifications": profile.consultation_notifications,
        "daily_reminders": profile.daily_reminders,

        # Privacy settings
        "share_reports": profile.share_reports,
        "allow_ai_analysis": profile.allow_ai_analysis,

        # Timestamps
        "created_at": profile.created_at,
        "updated_at": profile.updated_at,
    }


# ============================================================
# UPDATE USER PROFILE
# ============================================================

@router.put(
    "/user-profile",
    response_model=UserProfileResponse
)
def update_user_profile(
    profile_data: UserProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    profile = (
        db.query(UserProfile)
        .filter(
            UserProfile.user_id == current_user.id
        )
        .first()
    )

    # Create profile if it doesn't exist
    if not profile:
        profile = UserProfile(
            user_id=current_user.id
        )

        db.add(profile)
        db.flush()

    # Update fields
    data = profile_data.model_dump()

    for key, value in data.items():
        setattr(profile, key, value)

    db.commit()
    db.refresh(profile)

    return {
        "id": profile.id,
        "user_id": profile.user_id,

        # User account email
        "email": current_user.email,

        # Personal profile
        "full_name": profile.full_name,
        "phone": profile.phone,
        "location": profile.location,
        "date_of_birth": profile.date_of_birth,
        "gender": profile.gender,
        "profile_image": profile.profile_image,

        # Notification settings
        "email_digest": profile.email_digest,
        "upload_notifications": profile.upload_notifications,
        "consultation_notifications": profile.consultation_notifications,
        "daily_reminders": profile.daily_reminders,

        # Privacy settings
        "share_reports": profile.share_reports,
        "allow_ai_analysis": profile.allow_ai_analysis,

        # Timestamps
        "created_at": profile.created_at,
        "updated_at": profile.updated_at,
    }


# ============================================================
# UPLOAD PROFILE IMAGE
# ============================================================

@router.post("/user-profile/profile-image")
async def upload_profile_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # --------------------------------------------------------
    # Validate file
    # --------------------------------------------------------

    if not file.content_type:
        raise HTTPException(
            status_code=400,
            detail="Invalid file."
        )

    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image."
        )

    # --------------------------------------------------------
    # Read image
    # --------------------------------------------------------

    contents = await file.read()

    # Maximum 5 MB
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Image must be smaller than 5MB."
        )

    # --------------------------------------------------------
    # Create upload directory
    # --------------------------------------------------------

    upload_dir = os.path.join(
        "uploads",
        "profile_images"
    )

    os.makedirs(
        upload_dir,
        exist_ok=True
    )

    # --------------------------------------------------------
    # Generate unique filename
    # --------------------------------------------------------

    extension = os.path.splitext(
        file.filename or ""
    )[1].lower()

    if not extension:
        extension = ".jpg"

    filename = f"{uuid.uuid4()}{extension}"

    file_path = os.path.join(
        upload_dir,
        filename
    )

    # --------------------------------------------------------
    # Save image to disk
    # --------------------------------------------------------

    with open(file_path, "wb") as buffer:
        buffer.write(contents)

    # --------------------------------------------------------
    # Get existing profile
    # --------------------------------------------------------

    profile = (
        db.query(UserProfile)
        .filter(
            UserProfile.user_id == current_user.id
        )
        .first()
    )

    # Create profile if needed
    if not profile:
        profile = UserProfile(
            user_id=current_user.id
        )

        db.add(profile)
        db.flush()

    # --------------------------------------------------------
    # Store image path in database
    # --------------------------------------------------------

    image_path = f"/uploads/profile_images/{filename}"

    profile.profile_image = image_path

    # --------------------------------------------------------
    # Save database changes
    # --------------------------------------------------------

    db.commit()
    db.refresh(profile)

    print("======================================")
    print("PROFILE IMAGE SAVED")
    print("User ID:", current_user.id)
    print("Image Path:", profile.profile_image)
    print("======================================")

    return {
        "message": "Profile image uploaded successfully",
        "profile_image": profile.profile_image
    }