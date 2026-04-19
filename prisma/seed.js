import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 シードデータを作成中...');

  // Delete existing data
  await prisma.submission.deleteMany();
  await prisma.testCase.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.user.deleteMany();

  // Create sample problems
  const problem1 = await prisma.problem.create({
    data: {
      title: 'A + B',
      description:
        '2つの整数A, Bを入力として受け取り、その和を出力してください。\n\n【制約】\n・0 ≤ A, B ≤ 100',
      difficulty: 'Easy',
      acceptanceRate: 0.95,
      testCases: {
        create: [
          { input: '1 2', output: '3' },
          { input: '10 20', output: '30' },
          { input: '0 0', output: '0' },
        ],
      },
    },
  });

  const problem2 = await prisma.problem.create({
    data: {
      title: 'バブルソート',
      description:
        'N個の整数をバブルソートで昇順にソートしてください。\n\n【制約】\n・1 ≤ N ≤ 100\n・各要素は0以上100以下の整数',
      difficulty: 'Medium',
      acceptanceRate: 0.78,
      testCases: {
        create: [
          { input: '5\n3 1 4 1 5', output: '1 1 3 4 5' },
          { input: '3\n3 2 1', output: '1 2 3' },
        ],
      },
    },
  });

  const problem3 = await prisma.problem.create({
    data: {
      title: 'フィボナッチ数列',
      description:
        'N番目のフィボナッチ数を求めてください。\nフィボナッチ数列は以下の通りです：\nF(1) = 1, F(2) = 1, F(n) = F(n-1) + F(n-2) (n ≥ 3)\n\n【制約】\n・1 ≤ N ≤ 40',
      difficulty: 'Hard',
      acceptanceRate: 0.62,
      testCases: {
        create: [
          { input: '1', output: '1' },
          { input: '2', output: '1' },
          { input: '10', output: '55' },
        ],
      },
    },
  });

  console.log('✅ シードデータの作成が完了しました！');
  console.log(`  - 問題: ${problem1.title}`);
  console.log(`  - 問題: ${problem2.title}`);
  console.log(`  - 問題: ${problem3.title}`);
}

seed()
  .catch((error) => {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
