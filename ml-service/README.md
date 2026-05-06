# PCAS Placement Prediction Service

This is a standalone Machine Learning service for the Placement Cell Automation System. It predicts a student's placement probability using a Random Forest Classifier trained on academic and application data.

## Features
- **Predictive API**: REST endpoint to get placement probability.
- **ML Model**: Scikit-learn Random Forest implementation.
- **Training Script**: Automated generation and training using historical/synthetic data.

## Tech Stack
- **Python 3.9+**
- **FastAPI** (Web Framework)
- **Scikit-learn** (Machine Learning)
- **Pandas** (Data Manipulation)

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Train the model:
   ```bash
   python train.py
   ```

4. Run the API:
   ```bash
   uvicorn main:app --reload
   ```

## API Usage

**POST** `/predict`
```json
{
  "cgpa": 8.5,
  "branch": "CSE",
  "applications_count": 3
}
```

**Response**
```json
{
  "probability": 82.5,
  "score_level": "High",
  "advice": "Excellent profile! Focus on your interview skills."
}
```
