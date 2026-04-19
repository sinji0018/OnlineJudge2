# AIアニメーション生成オンラインジャッジシステム - 実装ガイド

このドキュメントは、AIアニメーション生成オンラインジャッジシステムの実装進捗と今後の実装方針をまとめています。

## 📋 実装完了事項

### ✅ プロジェクト基盤
- [x] Next.js 16 + TypeScript + App Router セットアップ
- [x] Tailwind CSS スタイリング設定
- [x] ESLint コード品質ツール
- [x] Prisma ORM + PostgreSQL データベース統合

### ✅ データベース設計
- [x] Users テーブル設計
- [x] Problems テーブル設計
- [x] Submissions テーブル設計
- [x] TestCases テーブル設計
- [x] Prisma マイグレーション実行
- [x] サンプルデータ作成（3つのサンプル問題）

### ✅ バックエンド API
- [x] `GET /api/problems` - 問題一覧取得
- [x] `GET /api/problems/[id]` - 問題詳細取得
- [x] `POST /api/submissions` - コード提出
- [x] `GET /api/submissions/[id]` - 提出結果取得
- [x] エラーハンドリング

### ✅ フロントエンド UI
- [x] Navigation コンポーネント
- [x] トップページ
- [x] 問題一覧ページ
- [x] 問題詳細ページ
  - [x] 問題文表示
  - [x] 入出力例表示
  - [x] コードエディタ
  - [x] AIヒント表示エリア（プレースホルダー）
  - [x] アニメーション生成エリア（プレースホルダー）
- [x] 提出履歴ページ
- [x] 提出結果ページ

### ✅ その他
- [x] README.md ドキュメント
- [x] DEPLOYMENT.md デプロイメントガイド
- [x] .env 環境変数設定
- [x] package.json scripts 設定
- [x] npm run seed コマンド

## 🔄 実装中・予定項目

### 🟡 優先度高

#### 1. ジャッジシステム実装
```typescript
// /lib/judge/judge.ts を拡張
- Docker コンテナを使用したコード実行
- C言語コンパイル・実行
- テストケース実行ループ
- 実行時間・メモリ計測
- 時間制限（TLE）検出
```

**実装手順:**
1. Docker イメージ作成（gcc ベース）
2. コンテナとの通信インターフェース実装
3. ジャッジエンジン完成
4. キューイングシステム追加

#### 2. ユーザー認証システム
```
- ユーザー登録ページ
- ログインページ
- NextAuth.js 統合
- JWT トークン管理
- セッション管理
```

**実装手順:**
1. NextAuth.js インストール・設定
2. ユーザー登録 API
3. ログイン API
4. 認証保護ミドルウェア

### 🟠 優先度中

#### 3. AI生成ヒント機能
```
- OpenAI API 統合
- プロンプトエンジニアリング
- コードレビュー機能
- ヒント生成ロジック
```

**実装手順:**
1. OpenAI API キー設定
2. ヒント生成 API エンドポイント作成
3. フロントエンド UI 連携

#### 4. アルゴリズムアニメーション
```
- Canvas/SVG 描画実装
- アニメーション ライブラリ（Three.js / Pixi.js など）
- バブルソートアニメーション
- その他アルゴリズム可視化
```

**実装手順:**
1. アニメーション ライブラリ選定
2. バブルソートの可視化実装
3. その他のアルゴリズム実装

#### 5. 管理画面
```
- 問題管理（CRUD）
- テストケース管理
- ユーザー管理
- 統計情報表示
```

### 🔵 優先度低

#### 6. ランキング機能
- ユーザーランキング表示
- 正答数ランキング
- 解答時間ランキング

#### 7. コンテスト機能
- コンテスト作成・管理
- 参加登録
- スコアボード

#### 8. ログ・監視
- 提出ログ記録
- エラーログ
- パフォーマンス監視
- ユーザーアクティビティ追跡

## 🏗️ 実装例

### ジャッジシステムの実装例

```typescript
// Docker コンテナを使用した C 言語実行例

export async function executeC(code: string, input: string): Promise<JudgeResponse> {
  // 1. Docker コンテナを起動
  // 2. ソースコードを保存
  // 3. コンパイル実行
  // 4. テストケース入力で実行
  // 5. 出力を取得
  // 6. 時間・メモリを計測
  // 7. コンテナ削除
  
  // 実装詳細は後で記述
}
```

### AI ヒント生成の実装例

```typescript
// OpenAI API を使用したヒント生成例

export async function generateHint(code: string, problemId: string): Promise<string> {
  // 1. 問題情報を取得
  // 2. OpenAI API に送信
  // 3. ヒントを生成
  // 4. キャッシュに保存
  
  // 実装詳細は後で記述
}
```

## 📁 新しいファイル構成（将来版）

```
lib/
├── judge/
│   ├── judge.ts           # ジャッジエンジン本体
│   ├── docker.ts          # Docker 連携
│   ├── queue.ts           # キューイングシステム
│   └── languages/
│       ├── c.ts           # C言語対応
│       ├── python.ts      # Python対応
│       └── javascript.ts  # JavaScript対応
├── ai/
│   ├── hints.ts           # ヒント生成
│   ├── animation.ts       # アニメーション生成
│   └── openai.ts          # OpenAI API 統合
├── auth/
│   ├── auth.ts            # 認証ロジック
│   └── nextauth.ts        # NextAuth.js 設定
└── monitoring/
    ├── logger.ts          # ログシステム
    └── metrics.ts         # メトリクス収集

components/
├── Auth/
│   ├── LoginForm.tsx
│   └── RegisterForm.tsx
├── Judge/
│   ├── CodeEditor.tsx
│   ├── JudgeResult.tsx
│   └── OutputDisplay.tsx
├── AI/
│   ├── HintPanel.tsx
│   └── AnimationPlayer.tsx
└── Admin/
    └── ProblemManagement.tsx

app/
├── auth/
│   ├── login/
│   ├── register/
│   └── callback/
├── admin/
│   └── problems/
└── api/
    ├── auth/
    ├── judge/
    └── ai/
```

## 🚀 デプロイメント手順

### Vercel へのデプロイ

```bash
# 1. Vercel CLI インストール
npm i -g vercel

# 2. ログイン
vercel login

# 3. デプロイ
vercel

# 4. 環境変数設定（Vercel ダッシュボード）
# - DATABASE_URL
# - OPENAI_API_KEY (後で追加)
# - NEXTAUTH_SECRET (後で追加)
```

### ローカルテスト

```bash
# 開発サーバー起動
npm run dev

# ビルド テスト
npm run build

# 本番環境シミュレーション
npm run start
```

## 📊 パフォーマンス最適化

### 実装予定

1. **キャッシング戦略**
   - 問題情報のキャッシング
   - 提出結果のキャッシング
   - Redis 統合（将来）

2. **データベース最適化**
   - インデックス追加
   - クエリ最適化
   - コネクションプーリング

3. **フロントエンド最適化**
   - Image 最適化
   - コード分割
   - レイジーロード

## 🔒 セキュリティ対策

### 実装予定

1. **入力検証**
   - コード検証
   - SQL インジェクション対策
   - XSS 対策

2. **認証・認可**
   - JWT 検証
   - レート制限
   - CSRF 対策

3. **コード実行セキュリティ**
   - Docker サンドボックス
   - リソース制限（CPU、メモリ、時間）
   - ネットワーク隔離

## 📝 開発ノート

### 注意点

1. **ジャッジシステム**
   - 複数言語対応を考慮した設計
   - タイムアウト処理の正確な実装
   - メモリリーク防止

2. **スケーラビリティ**
   - 同時提出 100 件対応
   - キューイングシステム必須
   - 負荷分散検討

3. **ユーザー体験**
   - リアルタイム採点通知
   - プログレスバー表示
   - エラーメッセージの明確化

## 🤝 協力者向け情報

### コーディング規約

- TypeScript の厳密モード使用
- ESLint ルール遵守
- Prettier で自動フォーマット
- コメント・ドキュメント充実

### テスト戦略

```bash
# 将来実装予定
npm run test          # ユニットテスト
npm run test:e2e      # E2E テスト
npm run test:coverage # カバレッジ計測
```

## 📚 参考リソース

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Docker Documentation](https://docs.docker.com)
- [OpenAI API](https://platform.openai.com/docs)

---

**最終更新**: 2026年4月18日
**バージョン**: 0.1.0 (初期実装版)
