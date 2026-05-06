'use client';

import NavBar, { UserRole } from './NavBar';

interface AppShellProps {
  children: React.ReactNode;
  role: UserRole;
  userName: string;
}

export default function AppShell({ children, role, userName }: AppShellProps) {
  return (
    <div className="visible" style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <NavBar role={role} userName={userName} />
      <main>
        {children}
      </main>
    </div>
  );
}
