'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PostJob() {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    packageAmt: '',
    minCgpa: '',
    deadline: '',
    type: 'Full Time',
    description: ''
  });

  const [branches, setBranches] = useState<string[]>([]);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (branches.length === 0) {
      alert('Please select at least one eligible branch');
      return;
    }

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
        router.push('/recruiter/dashboard');
      } else {
        alert('Failed to post job');
      }
    } catch (err) {
      alert('Error posting job');
    }
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setBranches(selected);
  };

  return (
    <>
      <div className="section-header">
        <div className="section-title">Post a Job</div>
        <div className="section-sub">Create a new recruitment drive listing</div>
      </div>
      
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label>Job Title</label>
              <input type="text" placeholder="e.g. Software Engineer" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="form-field">
              <label>Company</label>
              <input type="text" placeholder="Company name" required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
            </div>
            <div className="form-field">
              <label>Location</label>
              <input type="text" placeholder="City" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
            <div className="form-field">
              <label>Package (LPA)</label>
              <input type="text" placeholder="e.g. 15 LPA" required value={formData.packageAmt} onChange={e => setFormData({...formData, packageAmt: e.target.value})} />
            </div>
            <div className="form-field">
              <label>Minimum CGPA</label>
              <input type="number" step="0.1" min="0" max="10" placeholder="e.g. 7.0" required value={formData.minCgpa} onChange={e => setFormData({...formData, minCgpa: e.target.value})} />
            </div>
            <div className="form-field">
              <label>Application Deadline</label>
              <input type="date" required value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
            </div>
            <div className="form-field">
              <label>Eligible Branches</label>
              <select multiple style={{ height: '90px' }} value={branches} onChange={handleBranchChange}>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
              </select>
              <span style={{ fontSize: '11px', color: 'var(--text2)' }}>Hold Ctrl to select multiple</span>
            </div>
            <div className="form-field">
              <label>Job Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option>Full Time</option>
                <option>Internship</option>
                <option>Part Time</option>
              </select>
            </div>
            <div className="form-field form-full">
              <label>Job Description</label>
              <textarea rows={4} placeholder="Describe the role, responsibilities, and requirements..." required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary">Post Job</button>
          </div>
        </form>
      </div>
    </>
  );
}
