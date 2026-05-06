import StatCard from '@/components/StatCard';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') redirect('/');

  const registeredStudents = await prisma.studentProfile.count();
  const openDrives = await prisma.job.count({ where: { status: 'OPEN' } });
  const totalApplications = await prisma.application.count();
  const studentsPlaced = await prisma.application.count({ where: { status: 'SELECTED' } });

  const stats = {
    registeredStudents,
    openDrives,
    totalApplications,
    studentsPlaced
  };

  const recentApps = await prisma.application.findMany({
    include: {
      student: { include: { user: true } },
      job: true
    },
    orderBy: { appliedAt: 'desc' },
    take: 5
  });

  const activeDrives = await prisma.job.findMany({
    where: { status: 'OPEN' },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return (
    <>
      <div className="section-header">
        <div className="section-title">Admin Dashboard</div>
        <div className="section-sub">Placement Cell Overview · JIIT Sector-128</div>
      </div>
      
      <div className="stats-grid">
        <StatCard label="Registered Students" value={stats.registeredStudents} subValue="All active" dotColorHex="var(--success)" colorHex="var(--accent)" />
        <StatCard label="Open Drives" value={stats.openDrives} subValue="6 total listings" colorHex="var(--accent3)" />
        <StatCard label="Total Applications" value={stats.totalApplications} subValue="across all companies" colorHex="var(--accent2)" />
        <StatCard label="Students Placed" value={stats.studentsPlaced} subValue="0% placement rate" colorHex="var(--success)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="table-card">
          <div className="table-head">
            <span className="table-title">Recent Applications</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Company</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentApps.length > 0 ? recentApps.map((a: any) => (
                <tr key={a.id}>
                  <td><b>{a.student.user.name}</b></td>
                  <td>{a.job.company}</td>
                  <td><span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span></td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', color: 'var(--text2)', padding: '24px' }}>No applications yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-card">
          <div className="table-head">
            <span className="table-title">Active Job Drives</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Deadline</th>
              </tr>
            </thead>
            <tbody>
              {activeDrives.length > 0 ? activeDrives.map((j: any) => (
                <tr key={j.id}>
                  <td><b>{j.company}</b></td>
                  <td>{j.title}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text2)' }}>{new Date(j.deadline).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', color: 'var(--text2)', padding: '24px' }}>No active drives</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
