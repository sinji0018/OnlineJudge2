"use client";

import Link from "next/link";

export function Navigation() {
  return (
    <nav className="bg-gray-900 text-white shadow-md border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="font-bold text-xl text-white hover:text-gray-300"
            >
              AIアニメーション生成オンラインジャッジシステム
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              href="/problems"
              className="text-gray-300 hover:text-white transition-colors"
            >
              問題
            </Link>
            <Link
              href="/submissions"
              className="text-gray-300 hover:text-white transition-colors"
            >
              提出履歴
            </Link>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              ログイン
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
