# AIアニメーション生成オンラインジャッジシステム

初学者向けのプログラミングのアルゴリズム教育プラットフォーム

## 機能概要

- 📚 **問題管理**: アルゴリズム学習用の問題を提供
- 💻 **コード提出**: C言語、Python、JavaScriptでコード提出
- ⚙️ **自動採点**: ジャッジシステムによる自動採点
- 💡 **AIヒント**: 生成AIによるヒント提示（実装予定）
- ✨ **アニメーション生成**: アルゴリズムの可視化（実装予定）

## 技術スタック

- **フロントエンド**: Next.js 16 + TypeScript + Tailwind CSS
- **バックエンド**: Next.js API Routes
- **データベース**: PostgreSQL + Prisma ORM
- **デプロイ**: Vercel
- **開発環境**: PostgreSQL on Prisma Postgres

## ディレクトリ構成

```
.
├── app/
│   ├── api/              # API Routes
│   │   ├── problems/     # 問題取得API
│   │   └── submissions/  # 提出管理API
│   ├── problems/         # 問題ページ
│   ├── submissions/      # 提出履歴ページ
│   ├── layout.tsx        # ルートレイアウト
│   └── page.tsx          # トップページ
├── components/           # React コンポーネント
├── lib/
│   ├── db/              # データベース関連
│   │   └── prisma.ts    # Prismaクライアント
│   └── judge/           # ジャッジエンジン
├── prisma/
│   └── schema.prisma    # Prismaスキーマ
├── public/              # 静的ファイル
└── package.json
```

## セットアップ

### 前提条件

- Node.js 18以上
- PostgreSQL（またはクラウドデータベース）

### インストール

```bash
npm install
```

### データベース設定

1. `.env`ファイルに`DATABASE_URL`を設定：

```env
DATABASE_URL="postgres://user:password@host:5432/database"
```

2. Prismaマイグレーション実行：

```bash
npx prisma db push
```

3. データベーススキーマ確認（オプション）：

```bash
npx prisma studio
```

## 開発サーバー起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## API仕様

### 問題取得

**GET** `/api/problems`

問題一覧を取得

```json
[
  {
    "id": "uuid",
    "title": "問題タイトル",
    "difficulty": "Easy",
    "acceptanceRate": 0.75
  }
]
```

### 問題詳細

**GET** `/api/problems/:id`

特定の問題詳細を取得

```json
{
  "id": "uuid",
  "title": "問題タイトル",
  "description": "問題文",
  "difficulty": "Easy",
  "testCases": [
    {
      "id": "uuid",
      "input": "1 2",
      "output": "3"
    }
  ]
}
```

### コード提出

**POST** `/api/submissions`

コードを提出

```json
{
  "problemId": "uuid",
  "language": "C",
  "code": "source code",
  "userId": "user-id (optional)"
}
```

レスポンス：

```json
{
  "id": "submission-id",
  "result": "Pending"
}
```

### 提出結果取得

**GET** `/api/submissions/:id`

提出結果を取得

```json
{
  "id": "uuid",
  "code": "source code",
  "result": "AC",
  "time": 100,
  "memory": 1024,
  "createdAt": "2026-04-18T..."
}
```

## ジャッジ判定種類

- **AC** (Accepted): 正解
- **WA** (Wrong Answer): 不正解
- **TLE** (Time Limit Exceeded): 時間超過
- **RE** (Runtime Error): 実行時エラー
- **CE** (Compile Error): コンパイルエラー
- **Pending**: 判定待ち

## データベーススキーマ

### Users

```
id        : UUID（ユーザーID）
email     : String（メール）
password  : String（ハッシュ化されたパスワード）
```

### Problems

```
id        : UUID（問題ID）
title     : String（タイトル）
description : Text（問題文）
difficulty : String（難易度）
acceptanceRate : Float（正答率）
```

### Submissions

```
id        : UUID（提出ID）
userId    : UUID（ユーザーID）
problemId : UUID（問題ID）
code      : Text（ソースコード）
language  : String（プログラミング言語）
result    : String（判定結果）
time      : Int（実行時間ms）
memory    : Int（メモリ使用量KB）
```

### TestCases

```
id        : UUID
problemId : UUID（問題ID）
input     : Text（入力）
output    : Text（出力）
```

## 実装状況

### 完了

- [x] Next.js プロジェクト初期化
- [x] Prisma ORM セットアップ
- [x] データベーススキーマ定義
- [x] 基本的なAPI実装
  - [x] GET /api/problems
  - [x] GET /api/problems/:id
  - [x] POST /api/submissions
  - [x] GET /api/submissions/:id
- [x] フロントエンドコンポーネント
  - [x] ナビゲーション
  - [x] トップページ
  - [x] 問題一覧ページ
  - [x] 問題詳細ページ
  - [x] 提出履歴ページ
  - [x] 提出結果ページ

### 実装予定

- [ ] ユーザー認証・登録
- [ ] AI生成ヒント機能
- [ ] アルゴリズムアニメーション生成
- [ ] Docker使用によるコード実行サンドボックス
- [ ] ジャッジシステムの完全実装
- [ ] ランキング機能
- [ ] コンテスト機能
- [ ] ログ機能
- [ ] 管理画面

## 開発ガイドライン

### データベースアクセス

Prismaクライアントを使用：

```typescript
import { prisma } from '@/lib/db/prisma';

// 例：問題取得
const problems = await prisma.problem.findMany();
```

### APIエラーレスポンス

```json
{
  "error": "エラーメッセージ"
}
```

## ライセンス

MIT

## 今後の改善

1. **セキュリティ**: コード実行をサンドボックス化（Docker）
2. **パフォーマンス**: キャッシング、CDN設定
3. **ユーザー体験**: プログレスバー、リアルタイム更新
4. **スケーラビリティ**: キューシステムの実装、負荷分散

## サポート

問題やバグを発見した場合は、Issueを作成してください。

---

**開発開始日**: 2026年4月18日
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
