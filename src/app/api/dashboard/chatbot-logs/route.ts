import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

const PAGE_SIZE = 50;

export async function GET(req: NextRequest) {
  const secret = process.env.DASHBOARD_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.POSTGRES_URL) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 }
    );
  }

  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page")) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  try {
    const [logsResult, countResult] = await Promise.all([
      sql`
        SELECT id, message, response, thread_id, ip_address, created_at
        FROM chatbot_logs
        ORDER BY created_at DESC
        LIMIT ${PAGE_SIZE} OFFSET ${offset}
      `,
      sql`SELECT COUNT(*) AS total FROM chatbot_logs`,
    ]);

    return NextResponse.json({
      logs: logsResult.rows,
      total: Number(countResult.rows[0].total),
      page,
      pageSize: PAGE_SIZE,
    });
  } catch (error) {
    console.error("Dashboard logs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
