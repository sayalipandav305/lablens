from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime



class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class GoogleLogin(BaseModel):
    credential: str


class MedicalProfileBase(BaseModel):
    full_name: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None

    height: Optional[float] = None
    weight: Optional[float] = None

    medical_conditions: List[str] = []
    family_history: List[str] = []

    allergies: List[str] = []

    medications: List[str] = []

    activity_level: Optional[str] = None
    smoking: Optional[str] = None
    alcohol: Optional[str] = None

    health_goals: List[str] = []


class MedicalProfileCreate(MedicalProfileBase):
    pass


class MedicalProfileResponse(MedicalProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class UserProfileCreate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    profile_image: Optional[str] = None

    email_digest: bool = True
    upload_notifications: bool = True
    consultation_notifications: bool = False
    daily_reminders: bool = True

    share_reports: bool = True
    allow_ai_analysis: bool = True


class UserProfileResponse(BaseModel):
    id: int
    user_id: int

    email: str | None = None



    full_name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    profile_image: Optional[str] = None

    email_digest: bool
    upload_notifications: bool
    consultation_notifications: bool
    daily_reminders: bool

    share_reports: bool
    allow_ai_analysis: bool

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True