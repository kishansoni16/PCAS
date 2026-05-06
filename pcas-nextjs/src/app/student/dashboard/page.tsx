import StatCard from '@/components/StatCard';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/');

  const student = await prisma.studentProfile.findUnique({
    where: { userId: (session.user as any).id },
    include: {
      user: true,
      applications: {
        include: { job: true },
        orderBy: { appliedAt: 'desc' }
      }
    }
  });

  if (!student) {
    return <div className="p-8">Please complete your profile to view the dashboard.</div>;
  }

  const eligibleJobsCount = await prisma.job.count({
    where: {
      status: 'OPEN',
      minCgpa: { lte: student.cgpa },
      eligibleBranches: { has: student.branch }
    }
  });

  const stats = {
    eligibleJobs: eligibleJobsCount,
    applications: student.applications.length,
    shortlisted: student.applications.filter(a => a.status === 'SHORTLISTED').length,
    offers: student.applications.filter(a => a.status === 'SELECTED').length
  };

  const recentApps = student.applications.slice(0, 5);

  const topJobs = await prisma.job.findMany({
    where: {
      status: 'OPEN',
      minCgpa: { lte: student.cgpa },
      eligibleBranches: { has: student.branch },
      applications: { none: { studentId: student.id } } // Only show jobs not applied to
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return (
    <>
      <div className="section-header">
        <div className="section-title">Welcome back, {student.user.name.split(' ')[0]} 👋</div>
        <div className="section-sub">{student.branch} · {student.year}rd Year · CGPA: {student.cgpa}</div>
      </div>

      <div className="stats-grid">
        <StatCard label="Eligible Jobs" value={stats.eligibleJobs} subValue="based on your CGPA & branch" colorHex="var(--accent3)" />
        <StatCard label="Applications" value={stats.applications} subValue="total submitted" colorHex="var(--accent)" />
        <StatCard label="Shortlisted" value={stats.shortlisted} subValue="awaiting interview" colorHex="var(--warn)" />
        <StatCard label="Offers" value={stats.offers} subValue="placement offers" colorHex="var(--success)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="table-card">
          <div className="table-head">
            <span className="table-title">Recent Applications</span>
            <Link href="/student/applications" className="btn btn-ghost btn-sm">View all</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.length === 0 && <tr><td colSpan={3} className="text-center text-sm text-gray-500 py-4">No applications yet</td></tr>}
                {recentApps.map((app: any) => (
                  <tr key={app.id}>
                    <td><b>{app.job.company}</b></td>
                    <td>{app.job.title}</td>
                    <td><span className={`badge badge-${app.status.toLowerCase()}`}>{app.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-card">
          <div className="table-head">
            <span className="table-title">Top Eligible Opportunities</span>
            <Link href="/student/jobs" className="btn btn-ghost btn-sm">Browse</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Package</th>
                  <th>Deadline</th>
                </tr>
              </thead>
              <tbody>
                {topJobs.length === 0 && <tr><td colSpan={3} className="text-center text-sm text-gray-500 py-4">No new eligible jobs</td></tr>}
                {topJobs.map((job: any) => (
                  <tr key={job.id}>
                    <td>
                      <b>{job.company}</b> <span style={{ fontSize: '11px', color: 'var(--text2)' }}>{job.title}</span>
                    </td>
                    <td style={{ color: 'var(--accent3)', fontWeight: 600 }}>{job.package}</td>
                    <td style={{ fontSize: '12px', color: 'var(--text2)' }}>{new Date(job.deadline).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
