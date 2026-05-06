'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

type Role = 'student' | 'admin' | 'recruiter';

export default function AuthBox() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<Role>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [year, setYear] = useState('3');
  const [cgpa, setCgpa] = useState('');
  
  const [companyName, setCompanyName] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isLogin) {
      try {
        const payload: any = { email, password, name, role };
        if (role === 'student') {
          payload.enrollmentNo = enrollmentNo;
          payload.branch = branch;
          payload.year = year;
          payload.cgpa = cgpa;
        } else if (role === 'recruiter') {
          payload.companyName = companyName;
        }
        
        const res = await fetch('/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Registration failed');
        }
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
        return;
      }
    }
    
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      role
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      if (role === 'student') router.push('/student/dashboard');
      else if (role === 'admin') router.push('/admin/dashboard');
      else router.push('/recruiter/dashboard');
    }
  };

  const placeholders = {
    student: 'you@jiit.ac.in',
    admin: 'admin@jiit.ac.in',
    recruiter: 'recruiter@jiit.ac.in'
  };

  return (
    <div className="auth-box">
      <div className="auth-logo">
        <div className="auth-logo-icon">PC</div>
        <div>
          <div className="auth-logo-text">PCAS</div>
          <div className="auth-logo-sub">Placement Cell Automation System</div>
        </div>
      </div>
      
      <div className="auth-title">Sign in to your portal</div>
      <div className="auth-sub">JIIT Sector-128 · Software Engineering Project</div>
      
      <div className="role-tabs">
        {(['student', 'admin', 'recruiter'] as Role[]).map((r) => (
          <button 
            key={r}
            className={`role-tab ${role === r ? 'active' : ''}`} 
            onClick={() => setRole(r)}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>
      
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border2)' }}>
        <button 
          style={{ flex: 1, padding: '8px', background: 'transparent', border: 'none', borderBottom: isLogin ? '2px solid var(--accent)' : '2px solid transparent', color: isLogin ? 'var(--accent)' : 'var(--text2)', fontWeight: 600, cursor: 'pointer' }}
          onClick={() => setIsLogin(true)}
        >
          Sign In
        </button>
        <button 
          style={{ flex: 1, padding: '8px', background: 'transparent', border: 'none', borderBottom: !isLogin ? '2px solid var(--accent)' : '2px solid transparent', color: !isLogin ? 'var(--accent)' : 'var(--text2)', fontWeight: 600, cursor: 'pointer' }}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="field">
            <label>Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe" 
            />
          </div>
        )}

        <div className="field">
          <label>Email</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholders[role]} 
          />
        </div>
        
        <div className="field">
          <label>Password</label>
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" 
          />
        </div>

        {!isLogin && role === 'student' && (
          <>
            <div className="field">
              <label>Enrollment No</label>
              <input type="text" required value={enrollmentNo} onChange={(e) => setEnrollmentNo(e.target.value)} placeholder="e.g. 9924010..." />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="field" style={{ flex: 1 }}>
                <label>Branch</label>
                <select value={branch} onChange={(e) => setBranch(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border2)', background: 'var(--bg3)', color: 'var(--text)' }}>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                </select>
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label>Year</label>
                <input type="number" required min="1" max="5" value={year} onChange={(e) => setYear(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>CGPA</label>
              <input type="number" step="0.1" min="0" max="10" required value={cgpa} onChange={(e) => setCgpa(e.target.value)} placeholder="e.g. 8.5" />
            </div>
          </>
        )}

        {!isLogin && role === 'recruiter' && (
          <div className="field">
            <label>Company Name</label>
            <input type="text" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Google" />
          </div>
        )}

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Register'}
        </button>
      </form>
      
      <div className="auth-demo">
        Demo accounts: 
        <span className="demo-tag">student@jiit.ac.in</span> 
        <span className="demo-tag">admin@jiit.ac.in</span> 
        <span className="demo-tag">recruiter@jiit.ac.in</span>
      </div>
    </div>
  );
}
