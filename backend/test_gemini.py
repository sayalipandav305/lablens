from services.gemini_extractor import extract_medical_data

sample = """
HbA1c 5.0 %
TSH 6.2 uIU/mL
"""

result = extract_medical_data(sample)

print(result)