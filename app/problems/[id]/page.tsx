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
  const [code, setCode] = useState(`print("Hello, World!")`);
  const [language, setLanguage] = useState("Python");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [input, setInput] = useState<string>("");
  const [executionResult, setExecutionResult] = useState<string>("");

  // Chat state for LLM
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Submission result state
  const [submissionResult, setSubmissionResult] = useState<{
    correct: boolean;
    message: string;
    details?: string;
  } | null>(null);

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
      // Set default input from first test case
      if (data.testCases && data.testCases.length > 0) {
        setInput(data.testCases[0].input);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmissionResult(null);

    try {
      // 全てのテストケースに対して正誤判定を行う
      if (!problem || !problem.testCases || problem.testCases.length === 0) {
        throw new Error("テストケースがありません");
      }

      let allCorrect = true;
      const results: string[] = [];

      for (const testCase of problem.testCases) {
        const response = await fetch("/api/execute", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            language,
            input: testCase.input,
          }),
        });

        if (!response.ok) {
          allCorrect = false;
          results.push(`テストケース${results.length + 1}: 実行エラー`);
          continue;
        }

        const result = await response.json();

        if (!result.success) {
          allCorrect = false;
          results.push(
            `テストケース${results.length + 1}: 実行エラー - ${result.error}`,
          );
          continue;
        }

        // 出力を正規化して比較
        const actualOutput = result.output?.trim() || "";
        const expectedOutput = testCase.output.trim();

        if (actualOutput === expectedOutput) {
          results.push(`テストケース${results.length + 1}: ✅ 正解`);
        } else {
          allCorrect = false;
          results.push(
            `テストケース${results.length + 1}: ❌ 不正解\n  期待: ${expectedOutput}\n  実際: ${actualOutput}`,
          );
        }
      }

      // 結果を設定
      if (allCorrect) {
        setSubmissionResult({
          correct: true,
          message: "🎉 全テストケース正解！",
          details: results.join("\n"),
        });
      } else {
        setSubmissionResult({
          correct: false,
          message: "❌ 不正解",
          details: results.join("\n"),
        });
      }

      // LLMによるレビューを取得
      setChatLoading(true);

      let reviewPrompt = "";
      if (allCorrect) {
        // 正解の場合は良い点を評価
        reviewPrompt = `必ず日本語で回答してください。英語では絶対に回答しないでください。
あなたはプログラミング初学者の先生です。
以下のコードは問題を解くことができ、全テストに合格しました。
子どもにもわかるように、シンプルな言葉で褒められるポイントを教えてください。

【問題】
${problem.title}

【使われた言語】
${language}

【出したコード】
${code}

【お願い】
- 難しい言葉使わない（例：可読性、計算量など）
- 短い文章で
- 1〜3つのシンプルな褒めるポイント
- 必ず日本語で回答（英語禁止）`;
      } else {
        // 不正解の場合はヒントを提供
        reviewPrompt = `必ず日本語で回答してください。英語では絶対に回答しないでください。
あなたはプログラミング初学者の先生です。
以下のコードは問題を解くことができませんでした。
答えは出さないでください。子どもにもわかるように、シンプルなヒントをください。

【問題】
${problem.title}
${problem.description}

【出したコード】
${language}:
${code}

【テスト結果】
${results.join("\n")}

【ヒントの出し方】
- 答えは言わない
- 簡単な言葉でヒントだけ
- 1〜2つのヒントをだす
- 必ず日本語で回答（英語禁止）`;
      }

      const llmResponse = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "phi3",
          prompt: reviewPrompt,
          stream: false,
        }),
      });

      if (llmResponse.ok) {
        const llmData = await llmResponse.json();
        const reviewContent =
          llmData.response || "レビューがありませんでした。";

        setChatMessages((prev) => [
          ...prev,
          {
            role: "user",
            content: allCorrect
              ? "コードのレビューをお願いします（正解）"
              : "コードのレビューをお願いします（不正解）",
          },
          {
            role: "assistant",
            content: allCorrect
              ? "✅ コードレビュー:\n" + reviewContent
              : "💡 ヒント & レビュー:\n" + reviewContent,
          },
        ]);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setSubmitting(false);
      setChatLoading(false);
    }
  };

  const handleExecute = async () => {
    setExecuting(true);
    setExecutionResult("");

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          input,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to execute code");
      }

      const result = await response.json();

      if (result.success) {
        let output = `実行成功!\n`;
        if (result.output) {
          output += `出力:\n${result.output}\n`;
        }
        if (result.error) {
          output += `標準エラー:\n${result.error}\n`;
        }
        output += `実行時間: ${result.executionTime}ms`;
        setExecutionResult(output);
      } else {
        setExecutionResult(`実行エラー:\n${result.error}`);
      }
    } catch (error) {
      setExecutionResult(
        "実行エラー: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    } finally {
      setExecuting(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setChatLoading(true);

    // Add user message to chat
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);

    try {
      // 日本語で回答するように指示を追加
      const promptWithInstruction = `以下の質問には日本語で回答してください。箇条書きにする場合は、改行を使って見やすくしてください。\n\n質問: ${userMessage}`;

      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3",
          prompt: promptWithInstruction,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from Ollama");
      }

      const data = await response.json();
      // 改行をHTMLの改行に変換して表示
      const assistantMessage = (
        data.response || "応答がありませんでした。"
      ).replace(/\n/g, "\n");

      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantMessage },
      ]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "エラー: " +
            (error instanceof Error ? error.message : "Unknown error"),
        },
      ]);
    } finally {
      setChatLoading(false);
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

              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                {/* 提出結果の表示 */}
                {submissionResult && (
                  <div
                    className={`mb-4 p-4 rounded-lg border ${
                      submissionResult.correct
                        ? "bg-green-900 border-green-700"
                        : "bg-red-900 border-red-700"
                    }`}
                  >
                    <h3
                      className={`font-bold text-lg mb-2 ${
                        submissionResult.correct
                          ? "text-green-100"
                          : "text-red-100"
                      }`}
                    >
                      {submissionResult.message}
                    </h3>
                    <pre
                      className={`text-sm whitespace-pre-wrap ${
                        submissionResult.correct
                          ? "text-green-200"
                          : "text-red-200"
                      }`}
                    >
                      {submissionResult.details}
                    </pre>
                  </div>
                )}

                <h3 className="font-bold text-white mb-4">💡 AIアシスタント</h3>

                {/* Chat Messages */}
                <div className="bg-gray-900 rounded-lg p-3 mb-3 max-h-64 overflow-y-auto border border-gray-600">
                  {chatMessages.length === 0 ? (
                    <p className="text-gray-400 text-sm">
                      AIに質問してみましょう
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {chatMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded-lg text-sm whitespace-pre-wrap ${
                            msg.role === "user"
                              ? "bg-blue-900 text-blue-100 ml-8"
                              : "bg-gray-700 text-gray-100 mr-8"
                          }`}
                        >
                          <span className="font-semibold text-xs block mb-1">
                            {msg.role === "user" ? "あなた" : "AI"}
                          </span>
                          {msg.content}
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="bg-gray-700 text-gray-300 p-2 rounded-lg mr-8 text-sm">
                          <span className="font-semibold text-xs block mb-1">
                            AI
                          </span>
                          考え中...
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="質問を入力..."
                    disabled={chatLoading}
                    className="flex-1 px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold transition-colors text-sm"
                  >
                    送信
                  </button>
                </form>
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
                        実行時の入力 (オプション)
                      </label>
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="実行時の入力を入力してください..."
                      />
                    </div>

                    <div className="border border-gray-600 rounded-lg overflow-hidden mb-4">
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
                        {submitting ? "判定中..." : "コードを提出"}
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
