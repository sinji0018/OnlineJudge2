import { Navigation } from "@/components/Navigation";

export default function Home() {
  return (
    <div>
      <Navigation />
      <main className="flex-1 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              AIアニメーション生成オンラインジャッジシステム
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              初学者向けのプログラミングのアルゴリズム教育プラットフォーム
            </p>
            <a
              href="/problems"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              問題を解く
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-2">🧠 学習問題</h3>
              <p className="text-gray-300">
                アルゴリズムの基礎から応用まで、段階的に学習できます。
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-2">🤖 AIヒント</h3>
              <p className="text-gray-300">
                生成AIが問題解法のヒントとコードレビューを提供します。
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-2">
                ✨ アニメーション
              </h3>
              <p className="text-gray-300">
                アルゴリズムを可視化したアニメーションで理解を深めます。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
