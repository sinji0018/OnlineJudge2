"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  acceptanceRate: number;
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // マウント後に実行（SSR/CSR の時間差を避ける）
    setIsMounted(true);
    
    const fetchProblems = async () => {
      try {
        const response = await fetch("/api/problems");
        if (!response.ok) {
          throw new Error("Failed to fetch problems");
        }
        const data = await response.json();
        setProblems(data);
        // sessionStorage にも保存（ブラウザバック対応）
        sessionStorage.setItem("problems", JSON.stringify(data));
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    // sessionStorage にキャッシュがあればそれを使用
    const cached = sessionStorage.getItem("problems");
    if (cached) {
      setProblems(JSON.parse(cached));
      setLoading(false);
    } else {
      fetchProblems();
    }
  }, []);

  return (
    <div>
      <Navigation />
      <main className="flex-1 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-white mb-8">問題一覧</h1>

          {loading && <p className="text-gray-300">読み込み中...</p>}
          {error && <p className="text-red-400">エラー: {error}</p>}

          {!loading && problems.length === 0 && (
            <p className="text-gray-300">問題がまだ登録されていません。</p>
          )}

          {!loading && problems.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full bg-gray-800 rounded-lg shadow-md border border-gray-700">
                <thead className="bg-gray-700 border-b border-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left font-bold text-white">
                      タイトル
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-white">
                      難易度
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-white">
                      正答率
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-white">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {problems.map((problem) => (
                    <tr
                      key={problem.id}
                      className="border-b border-gray-600 hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 text-white">{problem.title}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {(problem.acceptanceRate * 100).toFixed(1)}%
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`/problems/${problem.id}`}
                          className="text-blue-400 hover:text-blue-300 font-semibold"
                        >
                          詳細
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
