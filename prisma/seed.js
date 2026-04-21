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

  // 初学者向け問題
  const problem4 = await prisma.problem.create({
    data: {
      title: 'Hello, World!',
      description:
        'プログラミングの基本的な問題です。\n文字列 "Hello, World!" を出力してください。\n\n※ 改行は不要です。',
      difficulty: 'Easy',
      acceptanceRate: 0.99,
      testCases: {
        create: [
          { input: '', output: 'Hello, World!' },
        ],
      },
    },
  });

  const problem5 = await prisma.problem.create({
    data: {
      title: '掛け算',
      description:
        '2つの整数A, Bを入力として受け取り、その積を出力してください。\n\n【制約】\n・0 ≤ A, B ≤ 100',
      difficulty: 'Easy',
      acceptanceRate: 0.97,
      testCases: {
        create: [
          { input: '3 4', output: '12' },
          { input: '5 6', output: '30' },
          { input: '0 100', output: '0' },
        ],
      },
    },
  });

  const problem6 = await prisma.problem.create({
    data: {
      title: '偶数判定',
      description:
        '整数Nを入力として受け取ります。\nNが偶数なら "Even"、奇数なら "Odd" と出力してください。\n\n【制約】\n・1 ≤ N ≤ 1000',
      difficulty: 'Easy',
      acceptanceRate: 0.96,
      testCases: {
        create: [
          { input: '4', output: 'Even' },
          { input: '7', output: 'Odd' },
          { input: '100', output: 'Even' },
        ],
      },
    },
  });

  const problem7 = await prisma.problem.create({
    data: {
      title: '最大値',
      description:
        '3つの整数A, B, Cを入力として受け取り、その中で最大値を出力してください。\n\n【制約】\n・-100 ≤ A, B, C ≤ 100',
      difficulty: 'Easy',
      acceptanceRate: 0.98,
      testCases: {
        create: [
          { input: '3 5 2', output: '5' },
          { input: '-10 -5 -20', output: '-5' },
          { input: '100 50 100', output: '100' },
        ],
      },
    },
  });

  const problem8 = await prisma.problem.create({
    data: {
      title: '3の倍数判定',
      description:
        '整数Nを入力として受け取ります。\nNが3の倍数なら "Yes"、そうでなければ "No" と出力してください。\n\n【制約】\n・1 ≤ N ≤ 10000',
      difficulty: 'Easy',
      acceptanceRate: 0.97,
      testCases: {
        create: [
          { input: '9', output: 'Yes' },
          { input: '10', output: 'No' },
          { input: '300', output: 'Yes' },
        ],
      },
    },
  });

  const problem9 = await prisma.problem.create({
    data: {
      title: '1からNまでの合計',
      description:
        '整数Nを入力として受け取ります。\n1からNまでの整数の合計を出力してください。\n\n【制約】\n・1 ≤ N ≤ 1000',
      difficulty: 'Easy',
      acceptanceRate: 0.95,
      testCases: {
        create: [
          { input: '5', output: '15' },
          { input: '10', output: '55' },
          { input: '1', output: '1' },
        ],
      },
    },
  });

  const problem10 = await prisma.problem.create({
    data: {
      title: '階乗',
      description:
        '整数Nを入力として受け取ります。\nNの階乗（N!）を計算して出力してください。\n\n例: 5! = 5 × 4 × 3 × 2 × 1 = 120\n\n【制約】\n・1 ≤ N ≤ 12',
      difficulty: 'Easy',
      acceptanceRate: 0.93,
      testCases: {
        create: [
          { input: '5', output: '120' },
          { input: '1', output: '1' },
          { input: '6', output: '720' },
        ],
      },
    },
  });

  const problem11 = await prisma.problem.create({
    data: {
      title: '平均値',
      description:
        'N個の整数を入力として受け取ります。\n最初の行にN、次の行にN個の整数が空白で区切られて与えられます。\nそれらの平均値を計算して整数で出力してください。\n（小数点以下は切り捨てます）\n\n【制約】\n・1 ≤ N ≤ 100\n・各整数は0以上100以下',
      difficulty: 'Easy',
      acceptanceRate: 0.92,
      testCases: {
        create: [
          { input: '3\n10 20 30', output: '20' },
          { input: '4\n5 10 15 20', output: '12' },
          { input: '1\n100', output: '100' },
        ],
      },
    },
  });

  console.log('✅ シードデータの作成が完了しました！');
  console.log(`  - 問題: ${problem1.title}`);
  console.log(`  - 問題: ${problem2.title}`);
  console.log(`  - 問題: ${problem3.title}`);
  console.log(`  - 問題: ${problem4.title}`);
  console.log(`  - 問題: ${problem5.title}`);
  console.log(`  - 問題: ${problem6.title}`);
  console.log(`  - 問題: ${problem7.title}`);
  console.log(`  - 問題: ${problem8.title}`);
  console.log(`  - 問題: ${problem9.title}`);
  console.log(`  - 問題: ${problem10.title}`);
  console.log(`  - 問題: ${problem11.title}`);
}

seed()
  .catch((error) => {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
