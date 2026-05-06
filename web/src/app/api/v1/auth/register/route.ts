import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { email, password, name, role } = data;

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    if (role.toUpperCase() === 'STUDENT') {
      const { enrollmentNo } = data;
      if (enrollmentNo) {
        const existingStudent = await prisma.studentProfile.findUnique({
          where: { enrollmentNo }
        });
        if (existingStudent) {
          return NextResponse.json({ error: 'Enrollment number is already registered' }, { status: 400 });
        }
      }
    }

    // Create user and profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash: password, // using plaintext as per current auth setup
          name,
          role: role.toUpperCase()
        }
      });

      if (role.toUpperCase() === 'STUDENT') {
        const { enrollmentNo, branch, year, cgpa } = data;
        if (!enrollmentNo || !branch || !year || cgpa === undefined) {
          throw new Error('Missing student profile fields');
        }
        await tx.studentProfile.create({
          data: {
            userId: newUser.id,
            enrollmentNo,
            branch,
            year: Number(year),
            cgpa: Number(cgpa),
            skills: []
          }
        });
      } else if (role.toUpperCase() === 'RECRUITER') {
        const { companyName } = data;
        if (!companyName) {
          throw new Error('Missing company name');
        }
        await tx.recruiterProfile.create({
          data: {
            userId: newUser.id,
            companyName
          }
        });
      }

      return newUser;
    });

    return NextResponse.json({ message: 'Registration successful', userId: user.id }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}
