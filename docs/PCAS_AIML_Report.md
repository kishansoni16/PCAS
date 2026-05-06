JAYPEE INSTITUTE OF INFORMATION TECHNOLOGY
Sector-128, Noida
DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING
AND INFORMATION TECHNOLOGY

Placement Cell Automation System with AIML Integration

Submitted To:
Mr. Janardhan Kumar Verma
Department of Computer Science & Engineering and Information Technology

Submitted By:
992401040077 Kishan Soni
992401040073 Krishna Chawla
992401040079 Satyam Pundhir
992401040110 Siddhartha Tyagi

Course: Web Technologies & Applications(24B11CS225) | B.Tech IT | 2025–2026

Acknowledgement
We sincerely thank Mr. Janardhan Kumar Verma for his guidance and motivation throughout the project. We are grateful to the open-source community for the tools and frameworks that made this project feasible. We also thank our classmates, the Institute, and all those who supported the completion of this project.

Table of Contents
1. Customer Problem Statement
2. Goals, Requirements, and Analysis
3. Use Cases
4. Artificial Intelligence & Machine Learning (AIML) Integration
5. System Architecture & Microservices
6. Software Construction
7. Implementation
8. Test Case Report
9. Contribution of Each Team Member
10. Conclusion
11. References

---

1. Customer Problem Statement
1.1 Problem Statement
Every year, hundreds of final-year students at JIIT Noida approach the Placement Cell hoping to secure their first job. But the placement office runs almost entirely on manual effort. Students routinely miss drives, and recruiters waste time sifting through hundreds of profiles. The Placement Cell needs a centralized, digital platform that automates the placement lifecycle and uses AI to predict student placement readiness, ensuring every eligible student gets a fair opportunity and guided feedback.

1.2 Decomposition into Sub-problems
- Student Profile Management: No standardized digital way for students to maintain academic records and track status.
- Automated Eligibility Filtering: Manual shortlisting is slow and error-prone.
- Predictive Analytics (AIML): Students do not know their current market readiness.
- Secure Role-Based Access: Differentiated access for students, admins, and recruiters.

2. Goals, Requirements, and Analysis
2.1 Business Goals
- G1: Digitize and automate the end-to-end campus placement process.
- G2: Ensure fair and accurate eligibility-based student participation.
- G3: Integrate AIML to provide real-time placement probability predictions for students.
- G4: Enable real-time visibility and analytics for placement management.

3. Use Cases
3.1 Stakeholders
- Students (B.Tech IT/CSE/ECE): Primary users who register, maintain profiles, check AI predictions, and apply for drives.
- Placement Administrators: Manage the placement process, onboard companies, schedule drives, and generate reports.
- Recruiters: Post job roles, review shortlisted applicants, and update recruitment outcomes.

4. Artificial Intelligence & Machine Learning (AIML) Integration
4.1 Objective
To provide students with a real-time, data-driven "Placement Readiness Score" based on their academic and extracurricular profiles, helping them understand their chances and identify areas for improvement before actual company drives.

4.2 The Dataset (Big Data)
The Machine Learning model was trained on a massive synthetic dataset comprising 50,000 student records simulating historical university placement data. 
The dataset features include:
- CGPA (Core academic indicator)
- Branch (CSE, IT, ECE, EEE - representing industry demand)
- Application Activity (Proactivity indicator)
- Internships (Real-world experience)
- Technical Skills (Python, Java, SQL proficiency)
- Backlogs (Risk factor)
- Communication Score (Soft skills rating)

4.3 The Algorithm: Random Forest Classifier
A Random Forest Classifier algorithm was utilized for this predictive engine. 
- Why Random Forest? It is an ensemble learning method that constructs multiple decision trees during training and outputs the mode of the classes. It handles non-linear relationships effectively, prevents overfitting (which is common in single decision trees), and provides robust accuracy across diverse student profiles.
- Output: Instead of a simple binary (Placed/Not Placed), the model uses `predict_proba` to output a continuous percentage score (0% to 100%), which translates to High, Medium, or Low probability alongside actionable advice.

5. System Architecture & Microservices
5.1 Microservice Architecture
The system is built using a modern decoupled Microservice Architecture to ensure scalability and separation of concerns.
- Frontend & Core Backend: Developed using Next.js (React), managing user authentication, dashboards, and job applications.
- AI Prediction Engine: A completely separate microservice built with Python and FastAPI. This service loads the trained `.pkl` Random Forest model and exposes a RESTful API endpoint (`/predict`).

5.2 API Integration
When a student logs into their dashboard, the Next.js application makes an asynchronous REST API call to the Python FastAPI service, passing the student's current profile metrics. The Python service runs the data through the Random Forest model and instantly returns the calculated probability, which is then rendered on a dynamic "AI Readiness Gauge" on the student's screen.

6. Software Construction
6.1 Coding Standards & Refactoring
Standards adopted: modular API routes in Next.js, FastAPI routing for Python, centralized Prisma ORM schema.
Refactoring: The AI engine was completely decoupled from the Node.js backend into a Python service to leverage native Scikit-Learn capabilities.

6.2 Defensive Programming
- CGPA Boundary Check: Validated within [0.0, 10.0].
- JWT Authentication: Secure cross-origin requests.
- Error Handling: Fallbacks in the Next.js UI if the Python ML service is offline.

7. Implementation
The PCAS system was implemented as a multi-tier web application using Next.js, Python (FastAPI), and PostgreSQL. 
Key modules:
- Student Registration & Login (Next.js & NextAuth)
- AI Placement Predictor (Python, Scikit-learn, FastAPI)
- Job Drive Listing & Application Submission
- Admin Drive Management & Placement Reports
- Recruiter Shortlist View

8. Test Case Report
TC-01: Valid Student Login -> Dashboard displayed, JWT issued (Pass)
TC-02: AI Prediction API Call -> Returns valid percentage between 0-100 (Pass)
TC-03: Ineligible CGPA -> Application rejected (Pass)
TC-04: Admin Creates Drive -> Drive created, students notified (Pass)
TC-05: AI Service Offline -> UI shows graceful loading state instead of crashing (Pass)

9. Contribution of Each Team Member
- Kishan Soni (992401040077): Project lead; front-end development; system integration; Next.js architecture.
- Krishna Chawla (992401040073): Database schema design; authentication module; backend REST API.
- Satyam Pundhir (992401040079): Machine Learning Model development; Python FastAPI service; data generation (50k rows).
- Siddhartha Tyagi (992401040110): Eligibility filtering engine; testing strategy; documentation.

10. Conclusion
The Placement Cell Automation System (PCAS) successfully demonstrates the powerful combination of Full-Stack Web Development and Artificial Intelligence. By transitioning from a monolithic architecture to a microservices approach, the system effortlessly handles standard placement operations (via Next.js) while providing advanced predictive analytics (via Python/FastAPI). The inclusion of a Random Forest model trained on 50,000 records provides genuine value to students, moving the project beyond a simple CRUD application into an intelligent, data-driven platform.

11. References
- Pedregosa, F. et al. (2011). Scikit-learn: Machine Learning in Python. JMLR.
- Node.js Official Documentation. (2024). https://nodejs.org
- FastAPI Documentation. (2024). https://fastapi.tiangolo.com
- Next.js Documentation. (2024). https://nextjs.org
