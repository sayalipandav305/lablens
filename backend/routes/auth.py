from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database.database import get_db
from database.models import User, Report, SignupOTP

from database.schemas import (
    UserRegister,
    UserLogin,
    Token,
    GoogleLogin
)

from services.security import (
    hash_password,
    verify_password
)

from services.auth import (
    create_access_token,
    get_current_user
)

import os
import random
import smtplib

from datetime import datetime, timedelta
from email.message import EmailMessage

from dotenv import load_dotenv


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")


# ============================================================
# ROUTER
# ============================================================

router = APIRouter()


# ============================================================
# REQUEST SCHEMAS
# ============================================================

class EmailRequest(BaseModel):
    email: str


class OTPVerifyRequest(BaseModel):
    email: str
    otp: str


# ============================================================
# SEND OTP EMAIL
# ============================================================

def send_otp_email(
    email: str,
    otp: str
):

    SMTP_EMAIL = os.getenv("SMTP_EMAIL")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

    if not SMTP_EMAIL or not SMTP_PASSWORD:
        raise Exception(
            "SMTP_EMAIL or SMTP_PASSWORD is not configured."
        )

    message = EmailMessage()

    message["Subject"] = "LabLens - Email Verification OTP"
    message["From"] = SMTP_EMAIL
    message["To"] = email

    message.set_content(
        f"""
Hello,

Your LabLens verification OTP is:

{otp}

This OTP is valid for 5 minutes.

If you did not request this OTP, you can safely ignore this email.

Regards,
LabLens Team
"""
    )

    with smtplib.SMTP_SSL(
        "smtp.gmail.com",
        465
    ) as smtp:

        smtp.login(
            SMTP_EMAIL,
            SMTP_PASSWORD
        )

        smtp.send_message(message)


# ============================================================
# SEND SIGNUP OTP
# ============================================================

@router.post("/send-signup-otp")
def send_signup_otp(
    data: EmailRequest,
    db: Session = Depends(get_db)
):

    email = data.email.strip().lower()

    # --------------------------------------------------------
    # Validate email
    # --------------------------------------------------------

    if not email:

        raise HTTPException(
            status_code=400,
            detail="Email is required."
        )

    # --------------------------------------------------------
    # Check if user already exists
    # --------------------------------------------------------

    existing_user = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered. Please login."
        )

    # --------------------------------------------------------
    # Generate 6 digit OTP
    # --------------------------------------------------------

    otp = str(
        random.randint(
            100000,
            999999
        )
    )

    # OTP valid for 5 minutes

    expires_at = (
        datetime.utcnow()
        + timedelta(minutes=5)
    )

    # --------------------------------------------------------
    # Check if OTP already exists
    # --------------------------------------------------------

    existing_otp = (
        db.query(SignupOTP)
        .filter(
            SignupOTP.email == email
        )
        .first()
    )

    if existing_otp:

        existing_otp.otp = otp
        existing_otp.expires_at = expires_at
        existing_otp.verified = False

    else:

        new_otp = SignupOTP(
            email=email,
            otp=otp,
            expires_at=expires_at,
            verified=False
        )

        db.add(new_otp)

    db.commit()

    # --------------------------------------------------------
    # Send OTP email
    # --------------------------------------------------------

    try:

        send_otp_email(
            email,
            otp
        )

    except Exception as error:

        print(
            "OTP email error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to send OTP email."
        )

    return {
        "message": "OTP sent successfully."
    }


# ============================================================
# VERIFY SIGNUP OTP
# ============================================================

@router.post("/verify-signup-otp")
def verify_signup_otp(
    data: OTPVerifyRequest,
    db: Session = Depends(get_db)
):

    email = data.email.strip().lower()
    otp = data.otp.strip()

    # --------------------------------------------------------
    # Debug information
    # --------------------------------------------------------

    print("================================")
    print("OTP VERIFICATION")
    print("Email:", email)
    print(
        "OTP FROM FRONTEND:",
        repr(otp)
    )
    print("================================")

    # --------------------------------------------------------
    # Find OTP
    # --------------------------------------------------------

    signup_otp = (
        db.query(SignupOTP)
        .filter(
            SignupOTP.email == email
        )
        .first()
    )

    if not signup_otp:

        raise HTTPException(
            status_code=400,
            detail="OTP not found. Please request a new OTP."
        )

    # --------------------------------------------------------
    # Debug database OTP
    # --------------------------------------------------------

    print(
        "OTP FROM DATABASE:",
        repr(signup_otp.otp)
    )

    print(
        "OTP EXPIRES:",
        signup_otp.expires_at
    )

    print(
        "CURRENT TIME:",
        datetime.utcnow()
    )

    # --------------------------------------------------------
    # Check expiry
    # --------------------------------------------------------

    if datetime.utcnow() > signup_otp.expires_at:

        db.delete(signup_otp)

        db.commit()

        raise HTTPException(
            status_code=400,
            detail="OTP has expired. Please request a new OTP."
        )

    # --------------------------------------------------------
    # Check OTP
    # --------------------------------------------------------

    if (
        str(signup_otp.otp).strip()
        != str(otp).strip()
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid OTP."
        )

    # --------------------------------------------------------
    # Mark email as verified
    # --------------------------------------------------------

    signup_otp.verified = True

    db.commit()

    return {
        "message": "Email verified successfully."
    }


# ============================================================
# REGISTER
# ============================================================

@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    email = user.email.strip().lower()

    # --------------------------------------------------------
    # Check existing user
    # --------------------------------------------------------

    existing_user = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered."
        )

    # --------------------------------------------------------
    # Check OTP verification
    # --------------------------------------------------------

    signup_otp = (
        db.query(SignupOTP)
        .filter(
            SignupOTP.email == email
        )
        .first()
    )

    if (
        not signup_otp
        or not signup_otp.verified
    ):

        raise HTTPException(
            status_code=400,
            detail="Please verify your email before creating your account."
        )

    # --------------------------------------------------------
    # Create user
    # --------------------------------------------------------

    new_user = User(
        name=user.name,
        email=email,
        hashed_password=hash_password(
            user.password
        ),
        auth_provider="email"
    )

    db.add(new_user)

    # Remove OTP after successful registration

    db.delete(signup_otp)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "User registered successfully."
    }


# ============================================================
# LOGIN
# ============================================================

@router.post(
    "/login",
    response_model=Token
)
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = (
        db.query(User)
        .filter(
            User.email == user.email
        )
        .first()
    )

    if not db_user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # --------------------------------------------------------
    # Google account check
    # --------------------------------------------------------

    if db_user.auth_provider == "google":

        raise HTTPException(
            status_code=400,
            detail="This account uses Google Sign-In. Please continue with Google."
        )

    # --------------------------------------------------------
    # Verify password
    # --------------------------------------------------------

    if not verify_password(
        user.password,
        db_user.hashed_password
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # --------------------------------------------------------
    # Create JWT
    # --------------------------------------------------------

    access_token = create_access_token(
        {
            "sub": db_user.email,
            "user_id": db_user.id
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# ============================================================
# HISTORY
# ============================================================

@router.get("/history")
def get_history(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db)
):

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

    return reports


# ============================================================
# GOOGLE LOGIN
# ============================================================

@router.post("/google-login")
def google_login(
    data: GoogleLogin,
    db: Session = Depends(get_db)
):

    from google.oauth2 import id_token
    from google.auth.transport import requests

    try:

        # ----------------------------------------------------
        # Verify Google credential
        # ----------------------------------------------------

        idinfo = id_token.verify_oauth2_token(
            data.credential,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )

        email = idinfo["email"]

        name = idinfo.get(
            "name",
            "Google User"
        )

        # ----------------------------------------------------
        # Find existing user
        # ----------------------------------------------------

        db_user = (
            db.query(User)
            .filter(
                User.email == email
            )
            .first()
        )

        # ----------------------------------------------------
        # Create Google user
        # ----------------------------------------------------

        if not db_user:

            db_user = User(
                name=name,
                email=email,
                hashed_password=None,
                auth_provider="google"
            )

            db.add(db_user)

            db.commit()

            db.refresh(db_user)

        # ----------------------------------------------------
        # Generate JWT
        # ----------------------------------------------------

        access_token = create_access_token(
            {
                "sub": db_user.email,
                "user_id": db_user.id
            }
        )

        return {
            "access_token": access_token,
            "token_type": "bearer"
        }

    except ValueError:

        raise HTTPException(
            status_code=401,
            detail="Invalid Google token"
        )