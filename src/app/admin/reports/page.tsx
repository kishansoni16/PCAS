import StatCard from '@/components/StatCard';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function AdminReports() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') redirect('/');

  const studentsData = await prisma.studentProfile.findMany({
    include: {
      user: true,
      applications: true
    }
  });

  const jobsData = await prisma.job.findMany({
    include: {
      recruiter: true,
      _count: { select: { applications: true } }
    }
  });

  const totalStudents = studentsData.length;
  const placedStudents = studentsData.filter((s: any) => s.applications.some((a: any) => a.status === 'SELECTED')).length;
  const placementRate = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;
  
  const avgCgpa = totalStudents > 0 ? (studentsData.reduce((acc: number, s: any) => acc + s.cgpa, 0) / totalStudents).toFixed(2) : '0.00';
  
  const totalCompanies = new Set(jobsData.map((j: any) => j.company)).size;
  
  const highestPackage = jobsData.reduce((max: number, job: any) => {
    const pkg = parseFloat(job.package.split(' ')[0]) || 0;
    return pkg > max ? pkg : max;
  }, 0);

  const branches = ['CSE', 'IT', 'ECE', 'EEE'];
  const branchStats = branches.map((b: any) => {
    const bStudents = studentsData.filter((s: any) => s.branch === b);
    const bTotal = bStudents.length;
    const bPlaced = bStudents.filter((s: any) => s.applications.some((a: any) => a.status === 'SELECTED')).length;
    return {
      branch: b,
      total: bTotal,
      placed: bPlaced,
      rate: bTotal > 0 ? Math.round((bPlaced / bTotal) * 100) : 0
    };
  });

  const jobs = jobsData.map((j: any) => ({
    company: j.company,
    color: j.color,
    applicants: j._count.applications
  })).sort((a: any, b: any) => b.applicants - a.applicants).slice(0, 5);

  const students = studentsData.map((s: any) => ({
    name: s.user.name,
    branch: s.branch,
    cgpa: s.cgpa,
    applied: s.applications.length,
    shortlisted: s.applications.filter((a: any) => a.status === 'SHORTLISTED' || a.status === 'SELECTED').length,
    placed: s.applications.filter((a: any) => a.status === 'SELECTED').length
  })).sort((a: any, b: any) => b.cgpa - a.cgpa);

  return (
    <>
      <div className="section-header">
        <div className="section-title">Placement Reports</div>
        <div className="section-sub">Statistical analysis for institutional review</div>
      </div>
      
      <div className="stats-grid">
        <StatCard label="Overall Placement Rate" value={`${placementRate}%`} colorHex="var(--success)" />
        <StatCard label="Average CGPA" value={avgCgpa} colorHex="var(--accent)" />
        <StatCard label="Total Companies" value={totalCompanies} colorHex="var(--accent2)" />
        <StatCard label="Highest Package" value={`${highestPackage} LPA`} colorHex="var(--accent3)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="form-card">
          <div style={{ fontFamily: 'var(--font2)', fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Branch-wise Placement Rate</div>
          <div className="bar-chart">
            {branchStats.map(b => (
              <div key={b.branch} className="bar-row">
                <div className="bar-label">{b.branch}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${b.rate}%`, background: 'linear-gradient(90deg, var(--accent), var(--accent2))' }}>
                    {b.rate}%
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text2)', width: '50px', textAlign: 'right' }}>{b.placed}/{b.total}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-card">
          <div style={{ fontFamily: 'var(--font2)', fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Company-wise Applications</div>
          <div className="bar-chart">
            {jobs.map(j => (
              <div key={j.company} className="bar-row">
                <div className="bar-label" style={{ fontSize: '11px' }}>{j.company}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${j.applicants > 0 ? (j.applicants / Math.max(...jobs.map((x: any) => x.applicants), 1)) * 100 : 4}%`, background: j.color, minWidth: '20px' }}>
                    {j.applicants}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-head">
          <span className="table-title">Student-wise Placement Summary</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Branch</th>
                <th>CGPA</th>
                <th>Applied</th>
                <th>Shortlisted</th>
                <th>Placed</th>
                <th>Placement Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s: any, i: number) => {
                const cgpaClass = s.cgpa >= 8 ? 'cgpa-good' : s.cgpa >= 7 ? 'cgpa-ok' : 'cgpa-low';
                return (
                  <tr key={i}>
                    <td><b>{s.name}</b></td>
                    <td>{s.branch}</td>
                    <td><span className={`cgpa-chip ${cgpaClass}`}>{s.cgpa}</span></td>
                    <td>{s.applied}</td>
                    <td>{s.shortlisted}</td>
                    <td>{s.placed}</td>
                    <td><span className={`badge ${s.placed > 0 ? 'badge-selected' : 'badge-pending'}`}>{s.placed > 0 ? 'Placed' : 'Seeking'}</span></td>
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
