'use client';

import { useState, useEffect } from 'react';

export default function RecruiterApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = () => {
    fetch('/api/v1/applications')
      .then(res => res.json())
      .then(data => {
        setApplications(data);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (appId: string, status: string) => {
    try {
      const res = await fetch(`/api/v1/applications/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchApplications(); // refresh
      }
    } catch (e) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="p-8">Loading applications...</div>;

  return (
    <>
      <div className="section-header">
        <div className="section-title">Applications Manager</div>
        <div className="section-sub">{applications.length} total applications received</div>
      </div>

      <div className="table-card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Branch</th>
                <th>CGPA</th>
                <th>Company</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 && <tr><td colSpan={7} className="text-center text-sm text-gray-500 py-4">No applications received</td></tr>}
              {applications.map((a) => {
                const cgpaClass = a.student.cgpa >= 8 ? 'cgpa-good' : a.student.cgpa >= 7 ? 'cgpa-ok' : 'cgpa-low';
                return (
                  <tr key={a.id}>
                    <td>
                      <b>{a.student.user.name}</b><br />
                      <span style={{ fontSize: '11px', color: 'var(--text2)' }}>{a.student.enrollmentNo}</span>
                    </td>
                    <td>{a.student.branch}</td>
                    <td><span className={`cgpa-chip ${cgpaClass}`}>{a.student.cgpa}</span></td>
                    <td>{a.job.company}</td>
                    <td>{a.job.title}</td>
                    <td><span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span></td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-warn btn-sm" onClick={() => updateStatus(a.id, 'SHORTLISTED')} disabled={a.status === 'SHORTLISTED'}>Shortlist</button>
                        <button className="btn btn-success btn-sm" onClick={() => updateStatus(a.id, 'SELECTED')} disabled={a.status === 'SELECTED'}>Select</button>
                        <button className="btn btn-danger btn-sm" onClick={() => updateStatus(a.id, 'REJECTED')} disabled={a.status === 'REJECTED'}>Reject</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
