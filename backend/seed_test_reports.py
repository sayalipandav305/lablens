from datetime import datetime
from database.database import SessionLocal
from database.models import User, Report


# --------------------------------------------------
# CHANGE THIS TO YOUR LOGGED-IN USER'S EMAIL
# --------------------------------------------------

USER_EMAIL = "sayali.rpandav@gmail.com"


db = SessionLocal()

try:
    # Find user
    user = db.query(User).filter(User.email == USER_EMAIL).first()

    if not user:
        print("❌ User not found.")
        print("Check USER_EMAIL in seed_test_reports.py")
        exit()

    print(f"✅ Found user: {user.email}")

    # Same report structure, different TSH values
    test_reports = [
        {
            "date": datetime(2026, 8, 1),
            "tsh": 0.20,
            "status": "Low",
            "health_score": 80,
        },
        {
            "date": datetime(2026, 8, 6),
            "tsh": 0.35,
            "status": "Low",
            "health_score": 90,
        },
        {
            "date": datetime(2026, 8, 11),
            "tsh": 0.80,
            "status": "Normal",
            "health_score": 100,
        },
    ]

    for index, data in enumerate(test_reports, start=1):

        analysis = [
            {
                "name": "TSH",
                "value": data["tsh"],
                "unit": "µIU/mL",
                "status": data["status"],
                "reference_range": "0.4 - 4.0 µIU/mL",
            },
            {
                "name": "T3",
                "value": 1.2,
                "unit": "ng/mL",
                "status": "Normal",
                "reference_range": "0.8 - 2.0 ng/mL",
            },
            {
                "name": "T4",
                "value": 8.5,
                "unit": "µg/dL",
                "status": "Normal",
                "reference_range": "5.0 - 12.0 µg/dL",
            },
        ]

        summary = []

        if data["status"] == "Low":
            summary.append(
                f"TSH is below the normal range at {data['tsh']} µIU/mL."
            )
            summary.append(
                "TSH should be monitored in future thyroid profile reports."
            )
        else:
            summary.append(
                f"TSH is within the normal range at {data['tsh']} µIU/mL."
            )
            summary.append(
                "TSH has improved compared with the previous report."
            )

        summary.append(
            "T3 and T4 are within the normal reference range."
        )

        report = Report(
            filename=f"Thyroid_Profile_Test_{index}.pdf",
            upload_date=data["date"],
            health_score=data["health_score"],
            summary=summary,
            analysis_json=analysis,
            user_id=user.id,
        )

        db.add(report)

    db.commit()

    print("\n✅ Test reports successfully added!")
    print("--------------------------------")
    print("01 Aug 2026 → TSH 0.20 → Low")
    print("06 Aug 2026 → TSH 0.35 → Low")
    print("11 Aug 2026 → TSH 0.80 → Normal")
    print("--------------------------------")

except Exception as error:
    db.rollback()
    print("❌ Error:", error)

finally:
    db.close()