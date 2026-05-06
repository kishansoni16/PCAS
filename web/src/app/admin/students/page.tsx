'use client';

import { useState, useEffect } from 'react';
import StudentDetailsModal from '@/components/StudentDetailsModal';
import AddStudentModal from '@/components/AddStudentModal';

export default function AdminStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/v1/admin/students');
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleView = (student: any) => {
    setSelectedStudent(student);
    setIsDetailsOpen(true);
  };

  if (loading) return <div className="p-8">Loading student registry...</div>;

  return (
    <>
      <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div className="section-title">Student Registry</div>
          <div className="section-sub">{students.length} registered students</div>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddOpen(true)}>+ Add Student</button>
      </div>

      <div className="table-card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Enrollment</th>
                <th>Name</th>
                <th>Branch</th>
                <th>CGPA</th>
                <th>Applications</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 && <tr><td colSpan={7} className="text-center text-sm text-gray-500 py-4">No students registered yet</td></tr>}
              {students.map((s: any) => {
                const cgpaClass = s.cgpa >= 8 ? 'cgpa-good' : s.cgpa >= 7 ? 'cgpa-ok' : 'cgpa-low';
                const placed = s.applications && s.applications.some((a: any) => a.status === 'SELECTED');
                return (
                  <tr key={s.id}>
                    <td style={{ fontFamily: 'var(--font2)', fontSize: '12px', color: 'var(--text2)' }}>{s.enrollmentNo}</td>
                    <td><b>{s.user.name}</b></td>
                    <td>{s.branch}</td>
                    <td><span className={`cgpa-chip ${cgpaClass}`}>{s.cgpa}</span></td>
                    <td>{s._count.applications}</td>
                    <td><span className={`badge ${placed ? 'badge-selected' : 'badge-pending'}`}>{placed ? 'Placed' : 'Active'}</span></td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-ghost btn-sm" onClick={() => handleView(s)}>View</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <StudentDetailsModal 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        student={selectedStudent} 
      />

      <AddStudentModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={fetchStudents}
      />
    </>
  );
}
