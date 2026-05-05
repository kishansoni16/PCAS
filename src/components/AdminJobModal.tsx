'use client';

import { useState } from 'react';

interface AdminJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  recruiters: any[];
  onSuccess: () => void;
}

export default function AdminJobModal({ isOpen, onClose, recruiters, onSuccess }: AdminJobModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    packageAmt: '',
    minCgpa: '',
    deadline: '',
    type: 'Full Time',
    description: '',
    recruiterId: ''
  });

  const [branches, setBranches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (branches.length === 0) {
      alert('Please select at least one branch');
      return;
    }
    if (!formData.recruiterId) {
      alert('Please select a recruiter/company profile');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/v1/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          minCgpa: parseFloat(formData.minCgpa),
          branches
        })
      });

      if (res.ok) {
        alert('Job posted successfully!');
        onSuccess();
        onClose();
        setFormData({
          title: '',
          company: '',
          location: '',
          packageAmt: '',
          minCgpa: '',
          deadline: '',
          type: 'Full Time',
          description: '',
          recruiterId: ''
        });
        setBranches([]);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to post job');
      }
    } catch (err) {
      alert('Error connecting to API');
    } finally {
      setLoading(false);
    }
  };

  const toggleBranch = (branch: string) => {
    setBranches(prev => 
      prev.includes(branch) ? prev.filter(b => b !== branch) : [...prev, branch]
    );
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="form-card" style={{ width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Post New Job</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label>Associated Recruiter</label>
              <select 
                required 
                value={formData.recruiterId} 
                onChange={e => {
                  const r = recruiters.find(rec => rec.id === e.target.value);
                  setFormData({...formData, recruiterId: e.target.value, company: r?.companyName || ''});
                }}
              >
                <option value="">Select Recruiter Profile</option>
                {recruiters.map(r => (
                  <option key={r.id} value={r.id}>{r.companyName} ({r.user.name})</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>Job Title</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="form-field">
              <label>Location</label>
              <input type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
            <div className="form-field">
              <label>Package (LPA)</label>
              <input type="text" required value={formData.packageAmt} onChange={e => setFormData({...formData, packageAmt: e.target.value})} />
            </div>
            <div className="form-field">
              <label>Min CGPA</label>
              <input type="number" step="0.1" required value={formData.minCgpa} onChange={e => setFormData({...formData, minCgpa: e.target.value})} />
            </div>
            <div className="form-field">
              <label>Deadline</label>
              <input type="date" required value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
            </div>
            <div className="form-field">
              <label>Job Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option>Full Time</option>
                <option>Internship</option>
              </select>
            </div>
            <div className="form-field form-full">
              <label>Eligible Branches</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                {['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'].map(b => (
                  <button 
                    key={b} 
                    type="button"
                    onClick={() => toggleBranch(b)}
                    style={{
                      padding: '6px 12px', borderRadius: '6px', fontSize: '12px', border: '1px solid var(--border2)',
                      background: branches.includes(b) ? 'var(--accent)' : 'var(--bg4)',
                      color: branches.includes(b) ? '#fff' : 'var(--text)',
                      cursor: 'pointer'
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-field form-full">
              <label>Description</label>
              <textarea rows={3} required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            </div>
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Posting...' : 'Post Job'}</button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
