
# Code Review Report

## Overall Score
Score: 60 / 100

## Critical Issues (Must Fix)
- **Security Risk**: The code contains a potential security risk due to the use of `TODO` comments that contain sensitive information about the system's architecture and tone. This could be exploited by an attacker if the code is exposed.

## Architectural & Maintainability Concerns
- **Separation of Concerns**: The two prompts are not separated into distinct concerns, making it difficult to maintain and modify them independently.
- **DRY (Don't Repeat Yourself)**: The prompts contain repeated information about the role and goal, which could be extracted into a separate constant or function.

## Security & Performance
- **Data Leakage**: The `TODO` comments contain sensitive information that could potentially leak if the code is exposed. This should be removed or sanitized.
- **Input Validation**: There is no input validation for the prompts, which could lead to unexpected behavior or errors if invalid data is passed in.

## Refactoring Recommendations
- **Extract Constants**: Extract the repeated information about the role and goal into separate constants or functions to improve maintainability and reduce duplication.
- **Remove Sensitive Information**: Remove or sanitize the sensitive information contained in the `TODO` comments to prevent potential security risks.
---

## Review Metadata

- **File**: lib\prompts.js
- **Duration**: 2m 43s
- **Reviewed At**: Feb 13, 2026 12:13 AM
