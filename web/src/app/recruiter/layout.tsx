import AppShell from '@/components/AppShell';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'RECRUITER') {
    redirect('/');
  }

  return (
    <AppShell role="recruiter" userName={session.user?.name || 'Recruiter'}>
      {children}
    </AppShell>
  );
}
