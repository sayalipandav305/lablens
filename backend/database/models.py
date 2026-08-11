from datetime import datetime
from xmlrpc.client import Boolean



from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    JSON,
    Text,
    Float,
    Boolean
)

from sqlalchemy.orm import relationship

from database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)

    hashed_password = Column(String(255), nullable=True)

    auth_provider = Column(
        String(20),
        nullable=False,
        default="email"
    )

    created_at = Column(DateTime, default=datetime.utcnow)

    reports = relationship(
        "Report",
        back_populates="user",
        cascade="all, delete"
    )

    medical_profile = relationship(
     "MedicalProfile",
     back_populates="user",
     uselist=False,
     cascade="all, delete"
)
    
    user_profile = relationship(
    "UserProfile",
    back_populates="user",
    uselist=False,
    cascade="all, delete"
)

    
class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)

    filename = Column(String, nullable=False)

    upload_date = Column(DateTime, default=datetime.utcnow)

    health_score = Column(Integer)

    summary = Column(JSON)

    analysis_json = Column(JSON)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    user = relationship("User", back_populates="reports")   


class MedicalProfile(Base):
    __tablename__ = "medical_profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True
    )

    full_name = Column(String(100))
    date_of_birth = Column(String(20))
    gender = Column(String(20))
    blood_group = Column(String(10))

    height = Column(Float)
    weight = Column(Float)

    medical_conditions = Column(JSON, default=list)
    family_history = Column(JSON, default=list)

    allergies = Column(JSON, default=list)

    medications = Column(JSON, default=list)

    activity_level = Column(String(50))
    smoking = Column(String(30))
    alcohol = Column(String(30))

    health_goals = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    user = relationship(
        "User",
        back_populates="medical_profile"
    )


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    full_name = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    location = Column(String(100), nullable=True)
    date_of_birth = Column(String(20), nullable=True)
    gender = Column(String(20), nullable=True)
    profile_image = Column(String(500), nullable=True)

    email_digest = Column(Boolean, default=True)
    upload_notifications = Column(Boolean, default=True)
    consultation_notifications = Column(Boolean, default=False)
    daily_reminders = Column(Boolean, default=True)

    share_reports = Column(Boolean, default=True)
    allow_ai_analysis = Column(Boolean, default=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    user = relationship(
        "User",
        back_populates="user_profile"
    )
    
class SignupOTP(Base):
    __tablename__ = "signup_otps"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True
    )

    otp = Column(
        String(10),
        nullable=False
    )

    expires_at = Column(
        DateTime,
        nullable=False
    )

    verified = Column(
        Boolean,
        default=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )