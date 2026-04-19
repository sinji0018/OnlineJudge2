# Vercelデプロイメント設定

Node.jsのバージョンと環境変数を設定してください。

## 環境変数

`vercel.json`のセットアップが必要です。Vercelダッシュボードで以下の環境変数を設定してください：

```
DATABASE_URL=your_database_connection_string
```

## デプロイ手順

1. Vercelアカウントにログイン
2. GitHubリポジトリをVercelに接続
3. プロジェクト設定で環境変数を追加
4. 自動デプロイが開始されます

## 本番環境への最適化

- **キャッシング**: Vercelの自動キャッシングを活用
- **CDN**: Vercelの高速CDNでグローバル配信
- **スケーリング**: 自動スケーリング対応
