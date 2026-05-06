import AppShell from '@/components/AppShell';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <AppShell role="admin" userName={session.user?.name || 'Admin'}>
      {children}
    </AppShell>
  );
}
