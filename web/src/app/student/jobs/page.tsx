'use client';

import JobCard from '@/components/JobCard';
import { useState, useEffect } from 'react';

export default function StudentJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [jobsRes, profileRes] = await Promise.all([
          fetch('/api/v1/jobs'),
          fetch('/api/v1/students/my')
        ]);
        
        if (jobsRes.ok && profileRes.ok) {
          setJobs(await jobsRes.json());
          setStudent(await profileRes.json());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleApply = async (id: string | number) => {
    try {
      const res = await fetch('/api/v1/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: id })
      });
      if (res.ok) {
        alert('Applied successfully!');
        // Update local state to show applied
        setStudent({
          ...student,
          applications: [...(student.applications || []), { jobId: id }]
        });
      } else {
        alert('Failed to apply. You may have already applied.');
      }
    } catch (e) {
      alert('Error applying');
    }
  };

  if (loading) return <div className="p-8">Loading jobs...</div>;
  if (!student) return <div className="p-8">Please complete your profile to view jobs.</div>;


  return (
    <>
      <div className="section-header">
        <div className="section-title">Job Opportunities</div>
        <div className="section-sub">
          Showing {jobs.length} listings · <span style={{ color: 'var(--accent3)' }}>Green</span> = eligible based on your profile
        </div>
      </div>
      <div className="card-grid">
        {jobs.map((job: any) => (
          <JobCard
            key={job.id}
            id={job.id}
            title={job.title}
            company={job.company}
            logo={job.logo}
            colorHex={job.color}
            location={job.location}
            type={job.type}
            packageAmt={job.package}
            minCgpa={job.minCgpa}
            branches={job.eligibleBranches}
            deadline={job.deadline}
            status={job.status}
            userCgpa={student.cgpa}
            userBranch={student.branch}
            hasApplied={student.applications?.some((app: any) => app.jobId === job.id)}
            onApply={handleApply}
          />
        ))}
      </div>
    </>
  );
}
