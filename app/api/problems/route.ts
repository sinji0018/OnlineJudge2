import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const problems = await prisma.problem.findMany({
      select: {
        id: true,
        title: true,
        difficulty: true,
        acceptanceRate: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(problems);
  } catch (error) {
    console.error('Error fetching problems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problems' },
      { status: 500 }
    );
  }
}
