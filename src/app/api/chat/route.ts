import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://srv1626129.hstgr.cloud:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return NextResponse.json({ detail: "Request timeout" }, { status: 408 });
    }
    return NextResponse.json({ detail: "Backend unreachable" }, { status: 503 });
  }
}
