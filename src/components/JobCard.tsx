'use client';

interface JobCardProps {
  id: string | number;
  title: string;
  company: string;
  logo: string;
  colorHex: string;
  location: string;
  type: string;
  packageAmt: string;
  minCgpa: number;
  branches: string[];
  deadline: string;
  status: string;
  userCgpa: number;
  userBranch: string;
  hasApplied: boolean;
  onApply?: (id: string | number) => void;
}

export default function JobCard({
  id, title, company, logo, colorHex, location, type, packageAmt,
  minCgpa, branches, deadline, status, userCgpa, userBranch, hasApplied, onApply
}: JobCardProps) {
  const isEligible = userCgpa >= minCgpa && branches.includes(userBranch) && status.toLowerCase() === 'open';

  return (
    <div className="job-card" style={isEligible ? { borderColor: 'rgba(34,211,165,0.3)' } : {}}>
      <div className="job-card-top">
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div className="company-logo" style={{ background: colorHex }}>{logo}</div>
          <div>
            <div className="job-title">{title}</div>
            <div className="job-company">{company} · {location}</div>
          </div>
        </div>
        <span className={`badge badge-${status}`}>{status}</span>
      </div>
      
      <div className="job-pkg">{packageAmt}</div>
      
      <div className="job-tags">
        <span className="job-tag">{type}</span>
        {branches.map(b => <span key={b} className="job-tag">{b}</span>)}
      </div>
      
      <div className="job-eligibility">
        Min CGPA: <b>{minCgpa}</b> · Your CGPA:{' '}
        <b style={{ color: userCgpa >= minCgpa ? 'var(--success)' : 'var(--danger)' }}>{userCgpa}</b> ·{' '}
        Branch: <b style={{ color: branches.includes(userBranch) ? 'var(--success)' : 'var(--danger)' }}>{userBranch}</b>
        {isEligible ? (
          <span style={{ color: 'var(--accent3)', marginLeft: '6px' }}>✓ Eligible</span>
        ) : (
          <span style={{ color: 'var(--danger)', marginLeft: '6px' }}>✗ Not eligible</span>
        )}
      </div>
      
      <div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '12px' }}>
        Deadline: {new Date(deadline).toLocaleDateString()}
      </div>
      
      {status.toLowerCase() === 'open' ? (
        <button 
          className={`btn ${hasApplied ? 'btn-ghost' : 'btn-primary'} btn-sm`}
          disabled={!isEligible || hasApplied}
          style={(!isEligible || hasApplied) ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          onClick={() => onApply && onApply(id)}
        >
          {hasApplied ? 'Applied ✓' : 'Apply Now'}
        </button>
      ) : (
        <button className="btn btn-ghost btn-sm" disabled style={{ opacity: 0.5 }}>Closed</button>
      )}
    </div>
  );
}
