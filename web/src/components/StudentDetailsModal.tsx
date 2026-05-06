'use client';

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any;
}

export default function StudentDetailsModal({ isOpen, onClose, student }: StudentDetailsModalProps) {
  if (!isOpen || !student) return null;

  const cgpaClass = student.cgpa >= 8 ? 'cgpa-good' : student.cgpa >= 7 ? 'cgpa-ok' : 'cgpa-low';

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="form-card" style={{ width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Student Profile</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', fontWeight: 600, color: '#fff'
          }}>
            {student.user.name[0]}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px' }}>{student.user.name}</h3>
            <div style={{ color: 'var(--text2)', fontSize: '13px' }}>{student.user.email}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div className="info-item">
            <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>Enrollment No</label>
            <b>{student.enrollmentNo}</b>
          </div>
          <div className="info-item">
            <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>Branch</label>
            <b>{student.branch}</b>
          </div>
          <div className="info-item">
            <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>Current Year</label>
            <b>{student.year}rd Year</b>
          </div>
          <div className="info-item">
            <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>CGPA</label>
            <span className={`cgpa-chip ${cgpaClass}`}>{student.cgpa}</span>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '8px' }}>Technical Skills</label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {student.skills && student.skills.length > 0 ? student.skills.map((sk: string) => (
              <span key={sk} style={{ background: 'var(--bg4)', border: '1px solid var(--border2)', fontSize: '12px', padding: '4px 10px', borderRadius: '6px' }}>
                {sk}
              </span>
            )) : <span style={{ fontSize: '12px', color: 'var(--text2)' }}>No skills listed</span>}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '8px' }}>Resume</label>
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '13px' }}>📄 {student.resumeUrl ? 'resume.pdf' : 'Not uploaded'}</div>
            {student.resumeUrl && (
              <a href={student.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">View</a>
            )}
          </div>
        </div>

        <div>
          <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '12px' }}>Applications ({student.applications?.length || 0})</label>
          <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
            {student.applications && student.applications.length > 0 ? (
              <table style={{ width: '100%', fontSize: '12px' }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: 'var(--text2)' }}>
                    <th style={{ padding: '8px 0' }}>Job</th>
                    <th>Company</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {student.applications.map((app: any) => (
                    <tr key={app.id}>
                      <td style={{ padding: '8px 0' }}>{app.job.title}</td>
                      <td>{app.job.company}</td>
                      <td><span className={`badge badge-${app.status.toLowerCase()}`}>{app.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ fontSize: '12px', color: 'var(--text2)', textAlign: 'center', padding: '12px' }}>No applications yet</div>
            )}
          </div>
        </div>

        <div style={{ marginTop: '24px' }}>
          <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>Close Details</button>
        </div>
      </div>
    </div>
  );
}
