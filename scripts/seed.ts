import { prisma } from "@/lib/db/prisma";

async function main() {
  try {
    // Create problems
    const problems = await prisma.problem.createMany({
      data: [
        {
          title: "Hello World",
          description: `最初のプログラミング問題です。

与えられた文字列を出力してください。`,
          difficulty: "Easy",
          acceptanceRate: 95,
        },
        {
          title: "A + B",
          description: `2つの整数 A と B が与えられたとき、その合計を出力してください。`,
          difficulty: "Easy",
          acceptanceRate: 92,
        },
        {
          title: "Sum of N Numbers",
          description: `N個の整数が与えられたとき、それらの合計を出力してください。

第1行に N が与えられ、次の N 行に各整数が与えられます。`,
          difficulty: "Easy",
          acceptanceRate: 88,
        },
        {
          title: "Fibonacci Sequence",
          description: `N番目のフィボナッチ数を計算してください。

フィボナッチ数列は以下のように定義されます：
F(1) = 1, F(2) = 1, F(n) = F(n-1) + F(n-2)`,
          difficulty: "Medium",
          acceptanceRate: 75,
        },
        {
          title: "Prime Number Checker",
          description: `与えられた整数が素数かどうかを判定してください。

素数の場合は "YES"、そうでない場合は "NO" を出力します。`,
          difficulty: "Medium",
          acceptanceRate: 82,
        },
        {
          title: "Factorial",
          description: `与えられた整数 N の階乗を計算してください。

N! = N × (N-1) × (N-2) × ... × 1`,
          difficulty: "Easy",
          acceptanceRate: 90,
        },
        {
          title: "Palindrome Check",
          description: `与えられた文字列がパリンドロームかどうかを判定してください。

パリンドロームは前から読んでも後ろから読んでも同じ文字列です。`,
          difficulty: "Easy",
          acceptanceRate: 94,
        },
        {
          title: "Binary Search",
          description: `ソート済みの配列から指定された値を二分探索で見つけてください。

見つかった場合はインデックス（0-based）を、見つからなかった場合は -1 を出力します。`,
          difficulty: "Medium",
          acceptanceRate: 70,
        },
      ],
    });

    console.log(`Created ${problems.count} problems`);

    // Create test cases for each problem
    const problemsData = await prisma.problem.findMany();

    const testCasesData = [
      { problemId: problemsData[0]?.id, input: "", output: "Hello, World!" },
      { problemId: problemsData[1]?.id, input: "1 2", output: "3" },
      { problemId: problemsData[2]?.id, input: "3\n1\n2\n3", output: "6" },
      { problemId: problemsData[3]?.id, input: "10", output: "55" },
      { problemId: problemsData[4]?.id, input: "17", output: "YES" },
      { problemId: problemsData[5]?.id, input: "5", output: "120" },
      { problemId: problemsData[6]?.id, input: "racecar", output: "YES" },
      { problemId: problemsData[7]?.id, input: "5 3\n1 3 5 7 9", output: "1" },
    ];

    for (const testCase of testCasesData) {
      if (testCase.problemId) {
        await prisma.testCase.create({
          data: testCase,
        });
      }
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
