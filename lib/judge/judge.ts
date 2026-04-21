import { prisma } from "@/lib/db/prisma";
import { executeCode } from "@/lib/executor";

export type JudgeResult = "AC" | "WA" | "TLE" | "RE" | "CE";

interface JudgeResponse {
  result: JudgeResult;
  time: number;
  memory: number;
  stderr?: string;
}

/**
 * Trim and normalize output for comparison
 * @param output - Output to normalize
 * @returns Normalized output
 */
function normalizeOutput(output: string): string {
  return output
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

/**
 * Execute code with test case
 * @param code - Source code to execute
 * @param testInput - Input for the test case
 * @param expectedOutput - Expected output
 * @param language - Programming language (e.g., 'C', 'Python', 'JavaScript')
 * @returns Judge result
 */
export async function judgeCode(
  code: string,
  testInput: string,
  expectedOutput: string,
  language: string,
): Promise<JudgeResponse> {
  const startTime = Date.now();

  try {
    // Execute the code
    const result = executeCode(code, language, testInput);
    const executionTime = Date.now() - startTime;

    // Check for timeout (5 seconds)
    if (executionTime > 5000) {
      return {
        result: "TLE",
        time: executionTime,
        memory: 0,
        stderr: "Time Limit Exceeded (5 seconds)",
      };
    }

    // Check for compilation/runtime errors
    if (!result.success) {
      // Determine if it's a compilation error or runtime error
      if (result.error.includes("コンパイルエラー")) {
        return {
          result: "CE",
          time: executionTime,
          memory: 0,
          stderr: result.error,
        };
      } else {
        return {
          result: "RE",
          time: executionTime,
          memory: 0,
          stderr: result.error,
        };
      }
    }

    // Compare output with expected output
    const normalizedActual = normalizeOutput(result.output);
    const normalizedExpected = normalizeOutput(expectedOutput);

    if (normalizedActual === normalizedExpected) {
      return {
        result: "AC",
        time: executionTime,
        memory: 0,
      };
    } else {
      return {
        result: "WA",
        time: executionTime,
        memory: 0,
        stderr: `Expected:\n${normalizedExpected}\n\nGot:\n${normalizedActual}`,
      };
    }
  } catch (error) {
    return {
      result: "RE",
      time: Date.now() - startTime,
      memory: 0,
      stderr: error instanceof Error ? error.message : "Unknown error",
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
  language: string,
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
          result: "RE",
        },
      });
      return;
    }

    let maxTime = 0;
    let maxMemory = 0;

    // Run all test cases
    for (const testCase of problem.testCases) {
      const result = await judgeCode(
        code,
        testCase.input,
        testCase.output,
        language,
      );

      maxTime = Math.max(maxTime, result.time);
      maxMemory = Math.max(maxMemory, result.memory);

      // If any test case fails, immediately return with the failure result
      if (result.result !== "AC") {
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
        result: "AC",
        time: maxTime,
        memory: maxMemory,
      },
    });
  } catch (error) {
    console.error("Error processing submission:", error);
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        result: "RE",
      },
    });
  }
}
