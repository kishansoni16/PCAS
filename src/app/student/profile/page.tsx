import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ResumeUpload from '@/components/ResumeUpload';

export default async function StudentProfile() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/');

  const studentData = await prisma.studentProfile.findUnique({
    where: { userId: (session.user as any).id },
    include: { user: true }
  });

  if (!studentData) {
    return <div className="p-8">Profile not found. Please complete your registration.</div>;
  }

  const cgpaClass = studentData.cgpa >= 8 ? 'cgpa-good' : studentData.cgpa >= 7 ? 'cgpa-ok' : 'cgpa-low';

  return (
    <>
      <div className="section-header">
        <div className="section-title">My Profile</div>
        <div className="section-sub">Your placement profile visible to recruiters</div>
      </div>
      
      <div className="profile-card">
        <div className="profile-avatar" style={{ background: 'linear-gradient(135deg,#22d3a5,#4f8ef7)' }}>
          {studentData.user.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
        </div>
        <div className="profile-info">
          <h2>{studentData.user.name}</h2>
          <div style={{ fontSize: '13px', color: 'var(--text2)' }}>{studentData.user.email}</div>
          <div className="profile-meta">
            <div className="meta-item">🎓 {studentData.branch}</div>
            <div className="meta-item">📅 Year {studentData.year}</div>
            <div className="meta-item">🆔 {studentData.enrollmentNo}</div>
            <span className={`cgpa-chip ${cgpaClass}`}>CGPA {studentData.cgpa}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="form-card">
          <div style={{ fontFamily: 'var(--font2)', fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Academic Details</div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text2)' }}>Enrollment No.</span><b>{studentData.enrollmentNo}</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text2)' }}>Branch</span><b>{studentData.branch}</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text2)' }}>Year</span><b>{studentData.year}</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '8px 0' }}>
              <span style={{ color: 'var(--text2)' }}>CGPA</span><span className={`cgpa-chip ${cgpaClass}`}>{studentData.cgpa}</span>
            </div>
          </div>
          <div className="progress-bar" style={{ marginTop: '16px' }}>
            <div className="progress-fill" style={{ width: `${(studentData.cgpa / 10) * 100}%` }}></div>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text2)', marginTop: '4px' }}>{studentData.cgpa}/10.0</div>
        </div>

        <div className="form-card">
          <div style={{ fontFamily: 'var(--font2)', fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Skills & Resume</div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '8px' }}>Technical Skills</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {studentData.skills.map(sk => (
                <span key={sk} style={{ background: 'var(--bg4)', border: '1px solid var(--border2)', color: 'var(--text)', fontSize: '12px', padding: '4px 10px', borderRadius: '6px' }}>
                  {sk}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '8px' }}>Resume</div>
            <ResumeUpload currentResume={studentData.resumeUrl} />
          </div>
        </div>
      </div>
    </>
  );
}
