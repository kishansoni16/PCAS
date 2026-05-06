'use client';

import { useState, useEffect } from 'react';

export default function PlacementAI() {
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPrediction() {
      try {
        // 1. Get student profile data from our Next.js API
        const resProfile = await fetch('/api/v1/students/my');
        const student = await resProfile.json();

        // 2. Call the SEPARATE Python ML Service (running on port 8000)
        const resML = await fetch('http://localhost:8000/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cgpa: student.cgpa,
            branch: student.branch,
            applications_count: student.applications?.length || 0
          })
        });

        if (resML.ok) {
          setPrediction(await resML.json());
        }
      } catch (e) {
        console.error("ML Service not reachable. Make sure pcas-ml-service is running.");
      } finally {
        setLoading(false);
      }
    }
    getPrediction();
  }, []);

  if (loading) return (
    <div className="form-card ai-card" style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="ai-pulse"></div>
      <span style={{ marginLeft: '12px', color: 'var(--text2)' }}>AI is calculating your placement probability...</span>
    </div>
  );

  if (!prediction) return null;

  const getScoreColor = () => {
    if (prediction.score_level === 'High') return '#10b981';
    if (prediction.score_level === 'Medium') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="form-card ai-card" style={{ 
      background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)',
      border: '1px solid rgba(79, 70, 229, 0.2)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative AI Glow */}
      <div style={{ 
        position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', 
        background: 'var(--accent)', filter: 'blur(80px)', opacity: 0.2, borderRadius: '50%' 
      }}></div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
          <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={getScoreColor()} strokeWidth="3" strokeDasharray={`${prediction.probability}, 100`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)' }}>{prediction.probability}%</div>
            <div style={{ fontSize: '10px', color: 'var(--text2)', textTransform: 'uppercase' }}>Ready</div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>AIML Placement Predictor</span>
            <span className={`badge badge-${prediction.score_level.toLowerCase()}`} style={{ fontSize: '10px' }}>{prediction.score_level} Probability</span>
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
            {prediction.advice}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--accent)' }}>💡</span> Based on your CGPA and current application history.
          </div>
        </div>
      </div>
    </div>
  );
}
