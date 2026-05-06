import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const jobs = await prisma.job.findMany({
      include: {
        recruiter: { include: { user: true } },
        _count: { select: { applications: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['RECRUITER', 'ADMIN'].includes((session.user as any).role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, company, location, type, packageAmt, minCgpa, branches, deadline, description, recruiterId } = body;

    let targetRecruiterId = recruiterId;

    if ((session.user as any).role === 'RECRUITER') {
      const recruiterProfile = await prisma.recruiterProfile.findFirst({
        where: { userId: (session.user as any).id }
      });
      if (!recruiterProfile) {
        return NextResponse.json({ error: 'Recruiter profile not found' }, { status: 404 });
      }
      targetRecruiterId = recruiterProfile.id;
    }

    if (!targetRecruiterId) {
      return NextResponse.json({ error: 'Recruiter ID is required' }, { status: 400 });
    }

    const job = await prisma.job.create({
      data: {
        recruiterId: targetRecruiterId,
        title,
        company,
        location,
        type,
        package: packageAmt,
        minCgpa: parseFloat(minCgpa),
        eligibleBranches: branches,
        deadline: new Date(deadline),
        description,
        color: '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0'),
        logo: company.substring(0, 2).toUpperCase()
      }
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
