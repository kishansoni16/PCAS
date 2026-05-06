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

    const recruiters = await prisma.recruiterProfile.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { companyName: 'asc' }
    });
    
    return NextResponse.json(recruiters);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch recruiters' }, { status: 500 });
  }
}
