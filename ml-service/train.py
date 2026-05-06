import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import pickle
import os

def train_massive_model():
    print("Generating MASSIVE dataset (50,000 students)...")
    np.random.seed(42)
    n_samples = 50000
    
    # Core Features
    cgpa = np.random.uniform(5.0, 10.0, n_samples)
    branch = np.random.randint(1, 5, n_samples) # 1:CSE, 2:IT, 3:ECE, 4:Others
    internships = np.random.randint(0, 4, n_samples)
    backlogs = np.random.choice([0, 1], n_samples, p=[0.85, 0.15])
    
    # Skills (Binary 0 or 1)
    python = np.random.choice([0, 1], n_samples, p=[0.4, 0.6])
    java = np.random.choice([0, 1], n_samples, p=[0.6, 0.4])
    sql = np.random.choice([0, 1], n_samples, p=[0.5, 0.5])
    
    # Soft Skills Score (1-10)
    comm_score = np.random.uniform(1, 10, n_samples)
    
    # Logic for Placement (The "Truth")
    # Higher CGPA, no backlogs, more internships, and skills increase chance
    score = (cgpa / 10) * 0.4
    score += (1 - backlogs) * 0.2
    score += (internships / 3) * 0.15
    score += (python * 0.05) + (java * 0.05) + (sql * 0.05)
    score += (comm_score / 10) * 0.1
    
    # Add random noise
    placed = ((score + np.random.normal(0, 0.1, n_samples)) > 0.6).astype(int)
    
    # Create DataFrame
    df = pd.DataFrame({
        'cgpa': cgpa,
        'branch': branch,
        'apps': internships,
        'backlogs': backlogs,
        'python': python,
        'java': java,
        'sql': sql,
        'comm_score': comm_score,
        'placed': placed
    })
    
    # Save CSV for the user to show
    df.to_csv('placement_big_data.csv', index=False)
    print(f"Dataset saved: placement_big_data.csv ({n_samples} rows)")
    
    print("Training Massive Scale Random Forest...")
    # For the API, we use the features we have: CGPA, Branch, and Application Count
    X = df[['cgpa', 'branch', 'apps']] 
    y = df['placed']
    
    model = RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42)
    model.fit(X, y)
    
    with open('placement_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    
    print("Massive model trained successfully!")

if __name__ == "__main__":
    train_massive_model()
