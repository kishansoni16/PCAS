'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export type UserRole = 'student' | 'admin' | 'recruiter';

const NAV_TABS = {
  student: [
    { name: 'Dashboard', path: '/student/dashboard' },
    { name: 'Jobs', path: '/student/jobs' },
    { name: 'My Applications', path: '/student/applications' },
    { name: 'Profile', path: '/student/profile' },
  ],
  admin: [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Students', path: '/admin/students' },
    { name: 'Jobs', path: '/admin/jobs' },
    { name: 'Reports', path: '/admin/reports' },
  ],
  recruiter: [
    { name: 'Dashboard', path: '/recruiter/dashboard' },
    { name: 'Post Job', path: '/recruiter/post-job' },
    { name: 'Applications', path: '/recruiter/applications' },
    { name: 'Profile', path: '/recruiter/profile' },
  ],
};

interface NavBarProps {
  role: UserRole;
  userName: string;
}

export default function NavBar({ role, userName }: NavBarProps) {
  const pathname = usePathname();
  const tabs = NAV_TABS[role];

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  };

  const avatarColor = {
    student: '#22d3a5',
    admin: '#4f8ef7',
    recruiter: '#7c5cfc'
  }[role];

  return (
    <nav>
      <div className="nav-left">
        <div className="nav-brand">
          <div className="nav-brand-icon">PC</div>
          PCAS
        </div>
        <div className="nav-tabs">
          {tabs.map((tab) => (
            <Link 
              key={tab.path}
              href={tab.path}
              className={`nav-tab ${pathname.startsWith(tab.path) ? 'active' : ''}`}
            >
              {tab.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="nav-right">
        <div className="user-chip">
          <div 
            className="user-avatar" 
            style={{ background: avatarColor }}
          >
            {getInitials(userName)}
          </div>
          <span style={{ fontWeight: 500, fontSize: '13px' }}>{userName}</span>
          <span className={`role-badge badge-${role}`}>
            {role}
          </span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Sign out</button>
      </div>
    </nav>
  );
}
