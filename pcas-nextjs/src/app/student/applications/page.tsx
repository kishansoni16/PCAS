'use client';

import { useState, useEffect } from 'react';

export default function StudentApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  if (loading) return <div className="p-8">Loading applications...</div>;

  if (applications.length === 0) {
    return (
      <>
        <div className="section-header">
          <div className="section-title">My Applications</div>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>You haven&apos;t applied to any jobs yet.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="section-header">
        <div className="section-title">My Applications</div>
        <div className="section-sub">{applications.length} applications submitted</div>
      </div>
      <div className="table-card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Package</th>
                <th>Location</th>
                <th>Applied</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="company-logo" style={{ width: '28px', height: '28px', fontSize: '11px', borderRadius: '6px', background: app.job.color }}>
                        {app.job.logo}
                      </div>
                      <b>{app.job.company}</b>
                    </div>
                  </td>
                  <td>{app.job.title}</td>
                  <td style={{ color: 'var(--accent3)', fontWeight: 600 }}>{app.job.package}</td>
                  <td>{app.job.location}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text2)' }}>{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td><span className={`badge badge-${app.status.toLowerCase()}`}>{app.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
