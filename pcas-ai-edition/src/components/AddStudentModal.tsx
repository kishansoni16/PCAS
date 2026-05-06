'use client';

import { useState } from 'react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddStudentModal({ isOpen, onClose, onSuccess }: AddStudentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    enrollmentNo: '',
    branch: 'CSE',
    year: '1',
    cgpa: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: 'STUDENT',
          year: parseInt(formData.year),
          cgpa: parseFloat(formData.cgpa)
        })
      });

      if (res.ok) {
        alert('Student registered successfully!');
        onSuccess();
        onClose();
        setFormData({
          name: '', email: '', password: '', enrollmentNo: '',
          branch: 'CSE', year: '1', cgpa: ''
        });
      } else {
        const err = await res.json();
        alert(err.error || 'Registration failed');
      }
    } catch (error) {
      alert('Error connecting to registration API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="form-card" style={{ width: '90%', maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Add New Student</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label>Full Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="form-field">
              <label>Email Address</label>
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="form-field">
              <label>Temporary Password</label>
              <input type="text" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
            <div className="form-field">
              <label>Enrollment No</label>
              <input type="text" required value={formData.enrollmentNo} onChange={e => setFormData({...formData, enrollmentNo: e.target.value})} />
            </div>
            <div className="form-field">
              <label>Branch</label>
              <select value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})}>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
              </select>
            </div>
            <div className="form-field">
              <label>Year</label>
              <select value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})}>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
            <div className="form-field">
              <label>Current CGPA</label>
              <input type="number" step="0.1" min="0" max="10" required value={formData.cgpa} onChange={e => setFormData({...formData, cgpa: e.target.value})} />
            </div>
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Registering...' : 'Register Student'}</button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
