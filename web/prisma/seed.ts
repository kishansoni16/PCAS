import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Clearing existing data...');
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.recruiterProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding new data...');

  // 1. Create Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Ms. Kashish Mahajan',
      email: 'admin@jiit.ac.in',
      passwordHash: 'password123',
      role: 'ADMIN'
    }
  });

  // 2. Create Student
  const studentUser = await prisma.user.create({
    data: {
      name: 'Kishan Soni',
      email: 'student@jiit.ac.in',
      passwordHash: 'password123',
      role: 'STUDENT'
    }
  });
  const student = await prisma.studentProfile.create({
    data: {
      userId: studentUser.id,
      enrollmentNo: '992401040077',
      branch: 'IT',
      cgpa: 8.4,
      year: 3,
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      resumeUrl: 'Resume_Kishan.pdf'
    }
  });

  // 3. Create Recruiter
  const recruiterUser = await prisma.user.create({
    data: {
      name: 'HR Manager',
      email: 'recruiter@jiit.ac.in',
      passwordHash: 'password123',
      role: 'RECRUITER'
    }
  });
  const recruiter = await prisma.recruiterProfile.create({
    data: {
      userId: recruiterUser.id,
      companyName: 'TechCorp'
    }
  });

  // 4. Create Jobs
  const job1 = await prisma.job.create({
    data: {
      recruiterId: recruiter.id,
      title: 'Frontend Developer',
      company: 'TechCorp',
      logo: 'TC',
      color: '#4f8ef7',
      location: 'Noida',
      type: 'Full Time',
      package: '18 LPA',
      minCgpa: 7.0,
      eligibleBranches: ['CSE', 'IT'],
      deadline: new Date('2026-06-01'),
      status: 'OPEN',
      description: 'We are looking for a skilled Frontend Developer proficient in React and Next.js.'
    }
  });

  const job2 = await prisma.job.create({
    data: {
      recruiterId: recruiter.id,
      title: 'Backend Engineer',
      company: 'TechCorp',
      logo: 'TC',
      color: '#7c5cfc',
      location: 'Bengaluru',
      type: 'Full Time',
      package: '22 LPA',
      minCgpa: 8.0,
      eligibleBranches: ['CSE', 'IT'],
      deadline: new Date('2026-05-20'),
      status: 'OPEN',
      description: 'Join our scalable backend team using Node.js and PostgreSQL.'
    }
  });

  // 5. Create Application
  await prisma.application.create({
    data: {
      studentId: student.id,
      jobId: job1.id,
      status: 'APPLIED'
    }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
