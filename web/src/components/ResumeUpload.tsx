'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResumeUpload({ currentResume }: { currentResume: string | null }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Max size is 5MB.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch('/api/v1/students/resume', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Upload failed');
      
      alert('Resume uploaded successfully!');
      router.refresh();
    } catch (error) {
      alert('Error uploading resume');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
      <div style={{ fontSize: '13px', wordBreak: 'break-all' }}>📄 {currentResume || 'Not uploaded'}</div>
      
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {currentResume && (
          <a href={currentResume} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
            View
          </a>
        )}
        <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer', margin: 0, opacity: loading ? 0.5 : 1 }}>
          {loading ? 'Uploading...' : currentResume ? 'Replace' : 'Upload'}
          <input 
            type="file" 
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }} 
            onChange={handleUpload}
            disabled={loading}
          />
        </label>
      </div>
    </div>
  );
}
