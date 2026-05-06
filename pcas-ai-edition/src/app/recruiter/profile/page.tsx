export default function RecruiterProfile() {
  const recruiter = {
    name: 'HR Manager',
    email: 'recruiter@jiit.ac.in',
    company: 'TechCorp'
  };

  return (
    <>
      <div className="section-header">
        <div className="section-title">Recruiter Profile</div>
      </div>
      <div className="profile-card">
        <div className="profile-avatar" style={{ background: 'linear-gradient(135deg,var(--accent2),var(--accent))' }}>
          {recruiter.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
        </div>
        <div className="profile-info">
          <h2>{recruiter.name}</h2>
          <div style={{ fontSize: '13px', color: 'var(--text2)' }}>{recruiter.email}</div>
          <div className="profile-meta">
            <div className="meta-item">🏢 {recruiter.company}</div>
            <span className="role-badge badge-recruiter">Recruiter</span>
          </div>
        </div>
      </div>
    </>
  );
}
