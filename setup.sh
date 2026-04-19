#!/bin/bash

# AIアニメーション生成オンラインジャッジシステム - セットアップスクリプト

echo "🚀 セットアップを開始します..."

# Install dependencies
echo "📦 依存パッケージをインストール中..."
npm install

# Setup database
echo "🗄️  データベースをセットアップ中..."
npx prisma db push

# Seed database
echo "🌱 サンプルデータを作成中..."
npm run seed

# Build project
echo "🏗️  プロジェクトをビルド中..."
npm run build

echo "✅ セットアップが完了しました！"
echo ""
echo "開発サーバーを起動するには以下のコマンドを実行してください："
echo "npm run dev"
echo ""
echo "本番環境で実行するには以下のコマンドを実行してください："
echo "npm run start"
