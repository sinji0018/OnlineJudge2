'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';

interface Submission {
  id: string;
  problemId: string;
  result: string;
  time?: number;
  memory?: number;
  createdAt: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch submissions from API
    setLoading(false);
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navigation />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-white mb-8">提出履歴</h1>

          {loading && <p className="text-gray-300">読み込み中...</p>}

          {!loading && submissions.length === 0 && (
            <p className="text-gray-300">提出がまだありません。</p>
          )}

          {!loading && submissions.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full bg-gray-800 rounded-lg shadow-md border border-gray-700">
                <thead className="bg-gray-700 border-b border-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left font-bold text-white">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-white">
                      問題
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-white">
                      結果
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-white">
                      実行時間
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-white">
                      メモリ
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-white">
                      提出日時
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="border-b border-gray-600 hover:bg-gray-700">
                      <td className="px-6 py-4 text-white">
                        {submission.id}
                      </td>
                      <td className="px-6 py-4 text-white">
                        {submission.problemId}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            submission.result === 'AC'
                              ? 'bg-green-900 text-green-100'
                              : 'bg-red-900 text-red-100'
                          }`}
                        >
                          {submission.result}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {submission.time}ms
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {submission.memory}KB
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {new Date(submission.createdAt).toLocaleString('ja-JP')}
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
