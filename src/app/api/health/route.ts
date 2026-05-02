import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://srv1626129.hstgr.cloud:8000";

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/health`, {
      next: { revalidate: 0 },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json({ status: "error" }, { status: 503 });
  }
}
