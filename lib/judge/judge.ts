import { prisma } from '@/lib/db/prisma';

export type JudgeResult = 'AC' | 'WA' | 'TLE' | 'RE' | 'CE';

interface JudgeResponse {
  result: JudgeResult;
  time: number;
  memory: number;
  stderr?: string;
}

/**
 * Execute code with test case
 * @param code - Source code to execute
 * @param testInput - Input for the test case
 * @param language - Programming language (e.g., 'C')
 * @returns Judge result
 */
export async function judgeCode(
  code: string,
  testInput: string,
  language: string
): Promise<JudgeResponse> {
  try {
    // TODO: Implement Docker-based code execution
    // For now, return a mock response
    return {
      result: 'AC',
      time: 100,
      memory: 1024,
    };
  } catch (error) {
    return {
      result: 'RE',
      time: 0,
      memory: 0,
      stderr: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Process submission and run all test cases
 * @param submissionId - Submission ID
 * @param code - Source code
 * @param problemId - Problem ID
 * @param language - Programming language
 */
export async function processSubmission(
  submissionId: string,
  code: string,
  problemId: string,
  language: string
): Promise<void> {
  try {
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { testCases: true },
    });

    if (!problem) {
      await prisma.submission.update({
        where: { id: submissionId },
        data: {
          result: 'RE',
        },
      });
      return;
    }

    let allPassed = true;
    let maxTime = 0;
    let maxMemory = 0;

    for (const testCase of problem.testCases) {
      const result = await judgeCode(code, testCase.input, language);

      maxTime = Math.max(maxTime, result.time);
      maxMemory = Math.max(maxMemory, result.memory);

      if (result.result !== 'AC') {
        allPassed = false;
        await prisma.submission.update({
          where: { id: submissionId },
          data: {
            result: result.result,
            time: result.time,
            memory: result.memory,
          },
        });
        return;
      }
    }

    // All test cases passed
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        result: 'AC',
        time: maxTime,
        memory: maxMemory,
      },
    });
  } catch (error) {
    console.error('Error processing submission:', error);
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        result: 'RE',
      },
    });
  }
}
