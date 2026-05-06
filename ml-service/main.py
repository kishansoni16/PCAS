from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from model import PlacementModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="PCAS Placement ML Service")

# Allow CORS for our Next.js app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = PlacementModel()

class StudentData(BaseModel):
    cgpa: float
    branch: str
    applications_count: int

@app.get("/")
def read_root():
    return {"status": "PCAS ML Service is running"}

@app.post("/predict")
def predict(data: StudentData):
    # Map branch strings to IDs
    branch_map = {"CSE": 1, "IT": 2, "ECE": 3}
    branch_id = branch_map.get(data.branch, 4)
    
    probability = model.predict_probability(data.cgpa, branch_id, data.applications_count)
    advice = model.get_advice(probability, data.cgpa)
    
    return {
        "probability": round(probability * 100, 2),
        "score_level": "High" if probability > 0.75 else "Medium" if probability > 0.5 else "Low",
        "advice": advice
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
