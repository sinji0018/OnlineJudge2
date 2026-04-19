"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navigation } from "@/components/Navigation";

interface Submission {
  id: string;
  code: string;
  result: string;
  time?: number;
  memory?: number;
  createdAt: string;
}

export default function SubmissionDetailPage() {
  const params = useParams();
  const submissionId = params.id as string;

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmission();
  }, [submissionId]);

  const fetchSubmission = async () => {
    try {
      const response = await fetch(`/api/submissions/${submissionId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch submission");
      }
      const data = await response.json();
      setSubmission(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "AC":
        return "bg-green-900 text-green-100";
      case "WA":
        return "bg-red-900 text-red-100";
      case "TLE":
        return "bg-orange-900 text-orange-100";
      case "RE":
        return "bg-red-900 text-red-100";
      case "CE":
        return "bg-yellow-900 text-yellow-100";
      default:
        return "bg-gray-800 text-gray-100";
    }
  };

  if (loading)
    return (
      <div className="bg-gray-900 min-h-screen text-white">読み込み中...</div>
    );
  if (error)
    return (
      <div className="bg-gray-900 min-h-screen text-white">エラー: {error}</div>
    );
  if (!submission)
    return (
      <div className="bg-gray-900 min-h-screen text-white">
        提出が見つかりません
      </div>
    );

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navigation />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gray-800 rounded-lg shadow-md p-8 border border-gray-700">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <p className="text-sm text-gray-300">提出ID</p>
                <p className="text-2xl font-bold text-white">{submission.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">結果</p>
                <p
                  className={`text-2xl font-bold px-4 py-2 rounded-lg inline-block ${getResultColor(
                    submission.result,
                  )}`}
                >
                  {submission.result}
                </p>
              </div>
            </div>

            {submission.result === "AC" && (
              <div className="bg-green-900 border border-green-700 rounded-lg p-4 mb-8">
                <p className="text-green-100">
                  ✅ 正解です！おめでとうございます！
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                <p className="text-sm text-gray-300 font-semibold">実行時間</p>
                <p className="text-xl text-white">{submission.time}ms</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                <p className="text-sm text-gray-300 font-semibold">
                  メモリ使用量
                </p>
                <p className="text-xl text-white">{submission.memory}KB</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">提出コード</h2>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-600">
                <code>{submission.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
