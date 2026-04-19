"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import Editor from "@monaco-editor/react";

interface TestCase {
  id: string;
  input: string;
  output: string;
}

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  testCases: TestCase[];
}

export default function ProblemDetailPage() {
  const params = useParams();
  const problemId = params.id as string;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState(`#include <stdio.h>
int main() {
  // ここにコードを書いてください
  return 0;
}`);
  const [language, setLanguage] = useState("C");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<string>("");

  useEffect(() => {
    fetchProblem();
  }, [problemId]);

  const fetchProblem = async () => {
    try {
      const response = await fetch(`/api/problems/${problemId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch problem");
      }
      const data = await response.json();
      setProblem(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problemId,
          language,
          code,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit code");
      }

      const result = await response.json();
      alert(`提出成功! ID: ${result.id}`);
      // Redirect to submission result page
      window.location.href = `/submissions/${result.id}`;
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleExecute = async () => {
    setExecuting(true);
    setExecutionResult("");

    try {
      // Mock execution result for now
      // In the future, this will call an API to execute the code
      setTimeout(() => {
        setExecutionResult(
          `実行結果 (モック):\nHello, World!\n\n実行時間: 0.001秒\nメモリ使用量: 1.2MB`,
        );
        setExecuting(false);
      }, 1000);
    } catch (error) {
      setExecutionResult(
        "実行エラー: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
      setExecuting(false);
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
  if (!problem)
    return (
      <div className="bg-gray-900 min-h-screen text-white">
        問題が見つかりません
      </div>
    );

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navigation />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side: Problem Statement */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">
                {problem.title}
              </h1>
              <p className="text-gray-300 mb-6 whitespace-pre-wrap">
                {problem.description}
              </p>

              <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-4">入出力例</h2>
                <div className="space-y-4">
                  {problem.testCases.map((testCase, index) => (
                    <div
                      key={testCase.id}
                      className="border border-gray-600 rounded-lg p-4"
                    >
                      <h3 className="font-bold text-white mb-2">
                        例{index + 1}
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-300 mb-1">
                            入力
                          </p>
                          <pre className="bg-gray-900 text-gray-100 p-2 rounded text-sm overflow-x-auto border border-gray-600">
                            {testCase.input}
                          </pre>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-300 mb-1">
                            出力
                          </p>
                          <pre className="bg-gray-900 text-gray-100 p-2 rounded text-sm overflow-x-auto border border-gray-600">
                            {testCase.output}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-900 rounded-lg p-4 border border-blue-700">
                <h3 className="font-bold text-blue-100 mb-2">💡 AIヒント</h3>
                <p className="text-blue-200">ヒント機能はまだ実装中です。</p>
              </div>
            </div>

            {/* Right side: Code Editor */}
            <div>
              <div className="sticky top-8">
                <form onSubmit={handleSubmit}>
                  <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-white mb-2">
                        プログラミング言語
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="C">C言語</option>
                        <option value="Python">Python</option>
                        <option value="JavaScript">JavaScript</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-white mb-2">
                        ソースコード
                      </label>
                      <div className="border border-gray-600 rounded-lg overflow-hidden">
                        <Editor
                          height="300px"
                          language={language.toLowerCase()}
                          value={code}
                          onChange={(value) => setCode(value || "")}
                          theme="vs-dark"
                          options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: "on",
                            roundedSelection: false,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 mb-4">
                      <button
                        type="button"
                        onClick={handleExecute}
                        disabled={executing}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold transition-colors"
                      >
                        {executing ? "実行中..." : "実行"}
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold transition-colors"
                      >
                        {submitting ? "提出中..." : "コードを提出"}
                      </button>
                    </div>

                    {executionResult && (
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-white mb-2">
                          実行結果
                        </label>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto border border-gray-600 whitespace-pre-wrap">
                          {executionResult}
                        </pre>
                      </div>
                    )}
                  </div>
                </form>

                <div className="mt-6 bg-purple-900 rounded-lg p-4 border border-purple-700">
                  <h3 className="font-bold text-purple-100 mb-2">
                    ✨ アニメーション生成
                  </h3>
                  <p className="text-purple-200">
                    アニメーション生成機能はまだ実装中です。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
