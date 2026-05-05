'use client';

import { useState, useEffect } from 'react';
import AdminJobModal from '@/components/AdminJobModal';

export default function AdminJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchJobs = () => {
    fetch('/api/v1/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  };

  const fetchRecruiters = () => {
    fetch('/api/v1/auth/register') // Wait, I need an endpoint for recruiters. I'll check if I have one.
      .then(res => res.json())
      .catch(e => console.error(e));
  };

  useEffect(() => {
    fetchJobs();
    // Fetch recruiters
    fetch('/api/v1/recruiters')
      .then(res => res.json())
      .then(data => setRecruiters(data))
      .catch(e => console.error(e));
  }, []);

  const viewApplicants = (id: string) => {
    // Navigate to applicants view (mocked for now)
    alert(`Viewing applicants for job ${id}`);
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
    try {
      const res = await fetch(`/api/v1/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchJobs();
      }
    } catch (e) {
      alert('Failed to toggle status');
    }
  };

  if (loading) return <div className="p-8">Loading jobs...</div>;

  return (
    <>
      <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div className="section-title">Job Management</div>
          <div className="section-sub">Manage all placement drives</div>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Post Job</button>
      </div>

      <AdminJobModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        recruiters={recruiters}
        onSuccess={fetchJobs}
      />

      <div className="table-card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Package</th>
                <th>Min CGPA</th>
                <th>Branches</th>
                <th>Applicants</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 && <tr><td colSpan={8} className="text-center text-sm text-gray-500 py-4">No jobs posted yet</td></tr>}
              {jobs.map(j => (
                <tr key={j.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="company-logo" style={{ width: '28px', height: '28px', fontSize: '10px', borderRadius: '5px', background: j.color }}>{j.logo}</div>
                      <b>{j.company}</b>
                    </div>
                  </td>
                  <td>{j.title}</td>
                  <td style={{ color: 'var(--accent3)', fontWeight: 600 }}>{j.package}</td>
                  <td>{j.minCgpa}</td>
                  <td style={{ fontSize: '12px' }}>{j.eligibleBranches.join(', ')}</td>
                  <td><b>{j._count.applications}</b></td>
                  <td><span className={`badge badge-${j.status.toLowerCase()}`}>{j.status}</span></td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-ghost btn-sm" onClick={() => viewApplicants(j.id)}>Applicants</button>
                      <button className={`btn btn-sm ${j.status === 'OPEN' ? 'btn-danger' : 'btn-success'}`} onClick={() => toggleStatus(j.id, j.status)}>
                        {j.status === 'OPEN' ? 'Close' : 'Open'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
