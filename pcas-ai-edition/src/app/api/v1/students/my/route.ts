import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const student = await prisma.studentProfile.findUnique({
      where: { userId: (session.user as any).id },
      include: {
        applications: {
          select: { jobId: true }
        }
      }
    });

    if (!student) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    return NextResponse.json(student);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch student profile' }, { status: 500 });
  }
}
