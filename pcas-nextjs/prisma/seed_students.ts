import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const students = [
    {
      email: 'rahul@jiit.ac.in',
      name: 'Rahul Kumar',
      password: 'password123',
      enrollmentNo: '992401040011',
      branch: 'CSE',
      cgpa: 9.2,
      year: 3
    },
    {
      email: 'priya@jiit.ac.in',
      name: 'Priya Sharma',
      password: 'password123',
      enrollmentNo: '992401040012',
      branch: 'IT',
      cgpa: 7.5,
      year: 3
    },
    {
      email: 'anjali@jiit.ac.in',
      name: 'Anjali Singh',
      password: 'password123',
      enrollmentNo: '992401040013',
      branch: 'ECE',
      cgpa: 6.2,
      year: 3
    },
    {
      email: 'amit@jiit.ac.in',
      name: 'Amit Patel',
      password: 'password123',
      enrollmentNo: '992401040014',
      branch: 'CSE',
      cgpa: 8.1,
      year: 3
    }
  ];

  console.log('Seeding new student profiles...');

  for (const s of students) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        email: s.email,
        name: s.name,
        passwordHash: s.password, // Plaintext for demo as per current system
        role: 'STUDENT',
        studentProfile: {
          create: {
            enrollmentNo: s.enrollmentNo,
            branch: s.branch,
            cgpa: s.cgpa,
            year: s.year,
            skills: ['Java', 'Python', 'React']
          }
        }
      }
    });
    console.log(`Created student: ${s.name} (${s.email})`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
