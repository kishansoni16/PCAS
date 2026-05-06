import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle
import os

class PlacementModel:
    def __init__(self):
        self.model_path = 'placement_model.pkl'
        self.model = None
        self.load_model()

    def load_model(self):
        if os.path.exists(self.model_path):
            with open(self.model_path, 'rb') as f:
                self.model = pickle.load(f)
        else:
            print("Model not found. Please run training script.")
            # Fallback to a simple rule-based mock if model is not trained yet
            self.model = None

    def predict_probability(self, cgpa, branch_id, applications_count):
        """
        Predicts placement probability (0-1).
        branch_id: 1 for CSE, 2 for IT, 3 for ECE, 4 for others
        """
        if self.model:
            # Format: [[cgpa, branch_id, apps]]
            prob = self.model.predict_proba([[cgpa, branch_id, applications_count]])[0][1]
            return float(prob)
        
        # Heuristic Fallback (Base Logic)
        score = (cgpa / 10) * 0.6
        branch_weights = {1: 0.3, 2: 0.28, 3: 0.22, 4: 0.15}
        score += branch_weights.get(branch_id, 0.1)
        score += min(applications_count, 5) * 0.02
        
        return min(max(score, 0), 1)

    def get_advice(self, probability, cgpa):
        if probability > 0.8:
            return "Excellent profile! Focus on your interview skills."
        elif probability > 0.6:
            return "Good chances. Try to increase your application count to top companies."
        elif cgpa < 7.5:
            return "Consider improving your CGPA to unlock more high-package roles."
        else:
            return "Keep building projects and applying to more diversified roles."
