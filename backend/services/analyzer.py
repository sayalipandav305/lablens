import re


def get_status(value, low, high):

    if value < low:
        return "Low"

    elif value > high:
        return "High"

    return "Normal"


def analyze_tests(tests):

    analyzed_tests = []

    for test in tests:

        try:
            value = float(test.get("value", ""))
        except (ValueError, TypeError):
            value = None

        reference_range = test.get(
            "reference_range",
            ""
        ).strip()

        status = "Unknown"

        if reference_range and value is not None:

            # Case 1: Range format
            # Example: 13.0 - 17.0

            numbers = re.findall(
                r"\d+(?:\.\d+)?",
                reference_range
            )

            if "-" in reference_range and len(numbers) >= 2:

                low = float(numbers[0])
                high = float(numbers[1])

                status = get_status(
                    value,
                    low,
                    high
                )

            # Case 2: Less than
            # Example: < 200

            elif reference_range.startswith("<") and len(numbers) >= 1:

                limit = float(numbers[0])

                if value < limit:
                    status = "Normal"
                else:
                    status = "High"

            # Case 3: Greater than
            # Example: > 40

            elif reference_range.startswith(">") and len(numbers) >= 1:

                limit = float(numbers[0])

                if value > limit:
                    status = "Normal"
                else:
                    status = "Low"

        analyzed_tests.append({
            "name": test.get("name", ""),
            "value": test.get("value", ""),
            "unit": test.get("unit", ""),
            "reference_range": reference_range,
            "status": status
        })

    return analyzed_tests