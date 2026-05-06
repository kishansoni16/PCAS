import StatCard from '@/components/StatCard';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function RecruiterDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/');

  const recruiter = await prisma.recruiterProfile.findUnique({
    where: { userId: (session.user as any).id },
    include: {
      jobs: {
        include: {
          _count: { select: { applications: true } }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!recruiter) {
    return <div className="p-8">Profile not found. Please complete your registration.</div>;
  }

  // Get total applications across all jobs
  const jobIds = recruiter.jobs.map((j: any) => j.id);
  const totalApplicants = await prisma.application.count({
    where: { jobId: { in: jobIds } }
  });

  const offersExtended = await prisma.application.count({
    where: { jobId: { in: jobIds }, status: 'SELECTED' }
  });

  const stats = {
    activeDrives: recruiter.jobs.filter((j: any) => j.status === 'OPEN').length,
    totalApplicants,
    eligiblePool: 1500, // Mocked overall pool for demo
    offersExtended
  };

  const myJobs = recruiter.jobs;

  return (
    <>
      <div className="section-header">
        <div className="section-title">Recruiter Portal</div>
        <div className="section-sub">{recruiter.companyName} · Manage your placement drives</div>
      </div>

      <div className="stats-grid">
        <StatCard label="Active Drives" value={stats.activeDrives} colorHex="var(--accent2)" />
        <StatCard label="Total Applicants" value={stats.totalApplicants} colorHex="var(--accent)" />
        <StatCard label="Eligible Pool" value={stats.eligiblePool} colorHex="var(--accent3)" />
        <StatCard label="Offers Extended" value={stats.offersExtended} colorHex="var(--success)" />
      </div>

      <div className="table-card">
        <div className="table-head">
          <span className="table-title">All Job Listings</span>
          <Link href="/recruiter/post-job" className="btn btn-primary btn-sm">+ Post New</Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Role</th>
                <th>Package</th>
                <th>Min CGPA</th>
                <th>Applicants</th>
                <th>Deadline</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {myJobs.map((j: any) => (
                <tr key={j.id}>
                  <td>
                    <b>{j.title}</b><br />
                    <span style={{ fontSize: '12px', color: 'var(--text2)' }}>{recruiter.companyName}</span>
                  </td>
                  <td style={{ color: 'var(--accent3)', fontWeight: 600 }}>{j.package}</td>
                  <td>{j.minCgpa}</td>
                  <td><b>{j._count.applications}</b></td>
                  <td style={{ fontSize: '12px', color: 'var(--text2)' }}>{new Date(j.deadline).toLocaleDateString()}</td>
                  <td><span className={`badge badge-${j.status.toLowerCase()}`}>{j.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
