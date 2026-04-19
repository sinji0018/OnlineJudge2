import { NextRequest, NextResponse } from "next/server";
import { executeCode } from "@/lib/executor";

export async function POST(request: NextRequest) {
  try {
    console.log("POST request received");
    const body = await request.json();
    console.log("Body parsed:", body);
    const { code, language, input = "" } = body;

    console.log("Execute request:", { code, language, input });

    if (!code || !language) {
      return NextResponse.json(
        { success: false, error: "Code and language are required" },
        { status: 400 },
      );
    }

    // Execute the code
    const result = executeCode(code, language, input);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Execute API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
