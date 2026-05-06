import AppShell from '@/components/AppShell';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'STUDENT') {
    redirect('/');
  }

  return (
    <AppShell role="student" userName={session.user?.name || 'Student'}>
      {children}
    </AppShell>
  );
}
