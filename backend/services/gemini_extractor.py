import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

# Initialize model
model = genai.GenerativeModel("gemini-2.5-flash")


def extract_medical_data(report_text):
    """
    Extract structured medical parameters from a lab report using Gemini.
    """

    prompt = f"""
You are an expert medical report extraction engine.

Your task is to extract ALL laboratory parameters from the medical report.

Return ONLY valid JSON.

Expected Format:

{{
  "tests": [
    {{
      "name": "HbA1c",
      "value": "5.0",
      "unit": "%",
      "reference_range": "4.0-5.6"
    }}
  ]
}}

Rules:
- Return ONLY JSON.
- Do NOT include markdown.
- Do NOT include explanations.
- Do NOT include ```json.
- Include every test parameter found.
- Store all values as strings.
- If a reference range is missing, use an empty string.
- Preserve units exactly as written.

Medical Report:

{report_text}
"""

    try:
        response = model.generate_content(prompt)

        print("\n===== RAW GEMINI RESPONSE =====")
        print(response.text)

        cleaned = response.text.strip()

        # Remove markdown wrappers if Gemini adds them
        if cleaned.startswith("```json"):
            cleaned = cleaned.replace("```json", "", 1)

        if cleaned.startswith("```"):
            cleaned = cleaned.replace("```", "", 1)

        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]

        cleaned = cleaned.strip()

        return json.loads(cleaned)

        print("\n===== PARSED JSON =====")
        print(parsed_data)

    except Exception as e:
        return {
            "error": str(e),
            "tests": []
        }