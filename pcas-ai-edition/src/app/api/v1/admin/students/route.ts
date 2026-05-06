import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const students = await prisma.studentProfile.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        applications: {
          include: {
            job: true
          }
        },
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { user: { name: 'asc' } }
    });
    
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}
