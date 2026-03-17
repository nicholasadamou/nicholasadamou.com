import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

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

  try {
    const [summaryResult, dailyResult, hourlyResult] = await Promise.all([
      sql`
        SELECT
          COUNT(*) AS total_queries,
          COUNT(DISTINCT ip_address) AS unique_ips,
          COUNT(DISTINCT thread_id) AS unique_threads,
          COALESCE(AVG(LENGTH(response)), 0)::int AS avg_response_length
        FROM chatbot_logs
      `,
      sql`
        SELECT
          DATE(created_at) AS date,
          COUNT(*) AS count
        FROM chatbot_logs
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,
      sql`
        SELECT
          EXTRACT(HOUR FROM created_at)::int AS hour,
          COUNT(*) AS count
        FROM chatbot_logs
        GROUP BY hour
        ORDER BY hour ASC
      `,
    ]);

    const summary = summaryResult.rows[0];

    // Fill in missing days in the last 30 days with 0
    const dailyMap = new Map<string, number>();
    for (const row of dailyResult.rows) {
      dailyMap.set(String(row.date).slice(0, 10), Number(row.count));
    }
    const dailyCounts: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dailyCounts.push({ date: key, count: dailyMap.get(key) ?? 0 });
    }

    // Fill in missing hours with 0
    const hourlyMap = new Map<number, number>();
    for (const row of hourlyResult.rows) {
      hourlyMap.set(Number(row.hour), Number(row.count));
    }
    const hourlyCounts = Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      count: hourlyMap.get(h) ?? 0,
    }));

    return NextResponse.json({
      totalQueries: Number(summary.total_queries),
      uniqueIps: Number(summary.unique_ips),
      uniqueThreads: Number(summary.unique_threads),
      avgResponseLength: Number(summary.avg_response_length),
      dailyCounts,
      hourlyCounts,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
