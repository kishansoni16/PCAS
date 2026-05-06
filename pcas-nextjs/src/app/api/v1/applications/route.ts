import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const role = (session.user as any).role;
    let applications;

    if (role === 'STUDENT') {
      const student = await prisma.studentProfile.findUnique({
        where: { userId: (session.user as any).id }
      });
      if (!student) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      
      applications = await prisma.application.findMany({
        where: { studentId: student.id },
        include: { job: true }
      });
    } else if (role === 'RECRUITER') {
      const recruiter = await prisma.recruiterProfile.findUnique({
        where: { userId: (session.user as any).id }
      });
      if (!recruiter) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

      applications = await prisma.application.findMany({
        where: { job: { recruiterId: recruiter.id } },
        include: { job: true, student: { include: { user: true } } }
      });
    } else {
      applications = await prisma.application.findMany({
        include: { job: true, student: { include: { user: true } } }
      });
    }

    return NextResponse.json(applications);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobId } = await req.json();

    const student = await prisma.studentProfile.findUnique({
      where: { userId: (session.user as any).id }
    });

    if (!student) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const application = await prisma.application.create({
      data: {
        studentId: student.id,
        jobId,
        status: 'APPLIED'
      }
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to apply' }, { status: 500 });
  }
}
