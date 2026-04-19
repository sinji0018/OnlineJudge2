import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as crypto from "crypto";

interface ExecutionResult {
  success: boolean;
  output: string;
  error: string;
  executionTime: number;
}

// Generate unique identifier
function generateUniqueId(): string {
  return crypto.randomBytes(8).toString("hex");
}

function executeCode(
  code: string,
  language: string,
  input: string,
): ExecutionResult {
  const startTime = Date.now();
  const tempDir = os.tmpdir();

  try {
    if (language === "Python") {
      return executePython(code, input, tempDir, startTime);
    } else if (language === "JavaScript") {
      return executeJavaScript(code, input, tempDir, startTime);
    } else if (language === "C") {
      return executeC(code, input, tempDir, startTime);
    } else {
      return {
        success: false,
        output: "",
        error: `Unsupported language: ${language}`,
        executionTime: Date.now() - startTime,
      };
    }
  } catch (error) {
    return {
      success: false,
      output: "",
      error: error instanceof Error ? error.message : "Unknown error",
      executionTime: Date.now() - startTime,
    };
  }
}

function executePython(
  code: string,
  input: string,
  tempDir: string,
  startTime: number,
): ExecutionResult {
  const uniqueId = generateUniqueId();
  const tempFile = path.join(tempDir, `code_${uniqueId}.py`);
  const inputFile = path.join(tempDir, `input_${uniqueId}.txt`);

  try {
    fs.writeFileSync(tempFile, code);
    if (input) {
      fs.writeFileSync(inputFile, input);
    }

    try {
      const command = input
        ? `python "${tempFile}" < "${inputFile}"`
        : `python "${tempFile}"`;
      const output = execSync(command, {
        encoding: "utf-8",
        timeout: 5000,
        stdio: ["pipe", "pipe", "pipe"],
      });

      return {
        success: true,
        output,
        error: "",
        executionTime: Date.now() - startTime,
      };
    } catch (execError: any) {
      let stdout = "";
      let stderr = "";

      if (execError.stdout) {
        stdout = execError.stdout.toString("utf-8");
      }
      if (execError.stderr) {
        stderr = execError.stderr.toString("utf-8");
      }

      return {
        success: false,
        output: stdout,
        error: stderr || execError.message,
        executionTime: Date.now() - startTime,
      };
    }
  } finally {
    try {
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
      if (fs.existsSync(inputFile)) {
        fs.unlinkSync(inputFile);
      }
    } catch {
      // Ignore cleanup errors
    }
  }
}

function executeJavaScript(
  code: string,
  input: string,
  tempDir: string,
  startTime: number,
): ExecutionResult {
  const uniqueId = generateUniqueId();
  const tempFile = path.join(tempDir, `code_${uniqueId}.js`);
  const inputFile = path.join(tempDir, `input_${uniqueId}.txt`);

  try {
    fs.writeFileSync(tempFile, code);
    if (input) {
      fs.writeFileSync(inputFile, input);
    }

    try {
      const command = input
        ? `node "${tempFile}" < "${inputFile}"`
        : `node "${tempFile}"`;
      const output = execSync(command, {
        encoding: "utf-8",
        timeout: 5000,
        stdio: ["pipe", "pipe", "pipe"],
      });

      return {
        success: true,
        output,
        error: "",
        executionTime: Date.now() - startTime,
      };
    } catch (execError: any) {
      let stdout = "";
      let stderr = "";

      if (execError.stdout) {
        stdout = execError.stdout.toString("utf-8");
      }
      if (execError.stderr) {
        stderr = execError.stderr.toString("utf-8");
      }

      return {
        success: false,
        output: stdout,
        error: stderr || execError.message,
        executionTime: Date.now() - startTime,
      };
    }
  } finally {
    try {
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
      if (fs.existsSync(inputFile)) {
        fs.unlinkSync(inputFile);
      }
    } catch {
      // Ignore cleanup errors
    }
  }
}

function executeC(
  code: string,
  input: string,
  tempDir: string,
  startTime: number,
): ExecutionResult {
  const uniqueId = generateUniqueId();
  const sourceFile = path.join(tempDir, `code_${uniqueId}.c`);
  const binaryFile = path.join(tempDir, `code_${uniqueId}.exe`);
  const inputFile = path.join(tempDir, `input_${uniqueId}.txt`);

  try {
    fs.writeFileSync(sourceFile, code);
    if (input) {
      fs.writeFileSync(inputFile, input);
    }

    // Compile
    try {
      execSync(`gcc "${sourceFile}" -o "${binaryFile}"`, {
        encoding: "utf-8",
        timeout: 5000,
        stdio: ["pipe", "pipe", "pipe"],
      });
    } catch (compileError: any) {
      let errorMsg = "";

      // Try to get stderr first, then fallback to stdout
      if (compileError.stderr) {
        errorMsg = compileError.stderr.toString("utf-8");
      } else if (compileError.stdout) {
        errorMsg = compileError.stdout.toString("utf-8");
      } else if (compileError.message) {
        errorMsg = compileError.message;
      }

      // Check if GCC is not found
      if (
        errorMsg.includes("gcc") &&
        (errorMsg.includes("not found") ||
          errorMsg.includes("not recognized") ||
          errorMsg.includes("CommandNotFound") ||
          errorMsg.includes("見つかりません"))
      ) {
        return {
          success: false,
          output: "",
          error: `GCCコンパイラが見つかりません。\n\nC言語でのコード実行にはGCCのインストールが必要です。\nMinGWまたはMSVC++をインストールしてください。`,
          executionTime: Date.now() - startTime,
        };
      }

      return {
        success: false,
        output: "",
        error: `コンパイルエラー:\n${errorMsg}`,
        executionTime: Date.now() - startTime,
      };
    }

    // Execute
    try {
      const command = input
        ? `"${binaryFile}" < "${inputFile}"`
        : `"${binaryFile}"`;
      const output = execSync(command, {
        encoding: "utf-8",
        timeout: 5000,
        stdio: ["pipe", "pipe", "pipe"],
      });

      return {
        success: true,
        output,
        error: "",
        executionTime: Date.now() - startTime,
      };
    } catch (execError: any) {
      let stdout = "";
      let stderr = "";

      if (execError.stdout) {
        stdout = execError.stdout.toString("utf-8");
      }
      if (execError.stderr) {
        stderr = execError.stderr.toString("utf-8");
      }

      return {
        success: false,
        output: stdout,
        error: stderr || execError.message,
        executionTime: Date.now() - startTime,
      };
    }
  } finally {
    // Clean up temporary files
    const filesToDelete = [sourceFile, binaryFile, inputFile];
    for (const file of filesToDelete) {
      try {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      } catch (err) {
        console.error(`Failed to delete ${file}:`, err);
      }
    }
  }
}

export { executeCode };
export type { ExecutionResult };
