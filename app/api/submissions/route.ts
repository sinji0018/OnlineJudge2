import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { processSubmission } from '@/lib/judge/judge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { problemId, language, code, userId } = body;

    // Validation
    if (!problemId || !language || !code) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create submission record
    const submission = await prisma.submission.create({
      data: {
        problemId,
        language,
        code,
        userId: userId || 'anonymous',
        result: 'Pending',
      },
    });

    // Process submission asynchronously
    processSubmission(submission.id, code, problemId, language).catch((error) => {
      console.error('Error processing submission:', error);
    });

    return NextResponse.json({
      id: submission.id,
      result: submission.result,
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
}
