"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RefreshCw } from "lucide-react";

interface ChatLog {
  id: number;
  message: string;
  response: string;
  thread_id: string | null;
  ip_address: string | null;
  created_at: string;
}

interface LogsResponse {
  logs: ChatLog[];
  total: number;
  page: number;
  pageSize: number;
}

interface Stats {
  totalQueries: number;
  uniqueIps: number;
  uniqueThreads: number;
  avgResponseLength: number;
  dailyCounts: { date: string; count: number }[];
  hourlyCounts: { hour: number; count: number }[];
}

export default function DashboardClient() {
  const {
    getTextColorClass,
    getOpacityClass,
    getHrColorClass,
    shouldUseDarkText,
    isHydrated,
  } = useTheme();

  const [secret, setSecret] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const POLL_INTERVAL_MS = 30_000;

  // Restore secret from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("dashboard_secret");
    if (saved) {
      setSecret(saved);
      setAuthenticated(true);
    }
  }, []);

  const fetchLogs = useCallback(async (p: number, token: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/dashboard/chatbot-logs?page=${p}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        setAuthenticated(false);
        sessionStorage.removeItem("dashboard_secret");
        setError("Invalid password");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch");
      const data: LogsResponse = await res.json();
      if (p === 1) {
        setLogs(data.logs);
      } else {
        setLogs((prev) => [...prev, ...data.logs]);
      }
      setTotal(data.total);
      setPage(data.page);
      setPageSize(data.pageSize);
    } catch {
      setError("Failed to load logs");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async (token: string) => {
    try {
      const res = await fetch("/api/dashboard/chatbot-stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data: Stats = await res.json();
      setStats(data);
      setLastUpdated(new Date());
    } catch {
      // stats are supplemental; ignore errors
    }
  }, []);

  // Silent background refresh — prepends new log entries, never flashes loading
  const silentRefresh = useCallback(async (token: string) => {
    setRefreshing(true);
    try {
      const [logsRes, statsRes] = await Promise.all([
        fetch("/api/dashboard/chatbot-logs?page=1", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/dashboard/chatbot-stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      if (logsRes.ok) {
        const data: LogsResponse = await logsRes.json();
        setLogs((prev) => {
          const existingIds = new Set(prev.map((l) => l.id));
          const newLogs = data.logs.filter((l) => !existingIds.has(l.id));
          return newLogs.length > 0 ? [...newLogs, ...prev] : prev;
        });
        setTotal(data.total);
      }
      if (statsRes.ok) {
        const data: Stats = await statsRes.json();
        setStats(data);
      }
      setLastUpdated(new Date());
    } catch {
      // ignore
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Fetch on auth
  useEffect(() => {
    if (authenticated && secret) {
      fetchLogs(1, secret);
      fetchStats(secret);
    }
  }, [authenticated, secret, fetchLogs, fetchStats]);

  // Polling
  const secretRef = useRef(secret);
  useEffect(() => {
    secretRef.current = secret;
  }, [secret]);

  useEffect(() => {
    if (!authenticated) return;
    const id = setInterval(
      () => silentRefresh(secretRef.current),
      POLL_INTERVAL_MS
    );
    return () => clearInterval(id);
  }, [authenticated, silentRefresh, POLL_INTERVAL_MS]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("dashboard_secret", secret);
    setAuthenticated(true);
  };

  const handleLoadMore = () => {
    fetchLogs(page + 1, secret);
  };

  if (!isHydrated) return <main className="min-h-screen" />;

  const light = shouldUseDarkText();
  const cardBg = light ? "bg-stone-950/[0.03]" : "bg-white/[0.04]";
  const hr = `border-dashed ${getOpacityClass()} ${getHrColorClass()}`;

  if (!authenticated) {
    return (
      <main
        className={`min-h-screen font-sans transition-colors duration-200 ${getTextColorClass()}`}
      >
        <div className="mx-auto max-w-2xl px-5 pt-24 pb-32 sm:pt-32 sm:pb-48">
          <div className="animate-fadeInHome1 space-y-6">
            <h1 className="text-3xl font-medium sm:text-4xl">Dashboard</h1>
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Enter password"
                className={`w-full rounded-lg px-3 py-2.5 text-sm outline-none ${cardBg}`}
                autoFocus
              />
              <button
                type="submit"
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-70 ${light ? "bg-stone-950 text-white" : "bg-white text-stone-950"}`}
              >
                Sign in
              </button>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </form>
          </div>
        </div>
      </main>
    );
  }

  const hasMore = logs.length < total;

  const chartColor = light ? "#1c1917" : "#e7e5e4";
  const tooltipStyle = {
    backgroundColor: light ? "#f5f5f4" : "#1c1917",
    border: "none",
    borderRadius: "6px",
    fontSize: "11px",
    color: light ? "#1c1917" : "#e7e5e4",
  };

  const statCards = stats
    ? [
        { label: "Total Queries", value: stats.totalQueries },
        { label: "Unique IPs", value: stats.uniqueIps },
        { label: "Unique Threads", value: stats.uniqueThreads },
        {
          label: "Avg Response",
          value: `${stats.avgResponseLength.toLocaleString()} chars`,
        },
      ]
    : [];

  return (
    <main
      className={`min-h-screen font-sans transition-colors duration-200 ${getTextColorClass()}`}
    >
      <div className="mx-auto max-w-4xl px-5 pt-24 pb-32 sm:pt-32 sm:pb-48">
        <div className="animate-fadeInHome1 space-y-8">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-medium sm:text-4xl">Dashboard</h1>
            <div
              className={`flex items-center gap-2 pt-2 text-xs ${getOpacityClass()}`}
            >
              {lastUpdated && (
                <span>
                  {lastUpdated.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              )}
              <button
                onClick={() => silentRefresh(secret)}
                disabled={refreshing}
                title="Refresh"
                className="cursor-pointer transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <RefreshCw
                  size={13}
                  className={refreshing ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>

          {/* Stat cards */}
          {statCards.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className={`rounded-lg p-4 ${cardBg} space-y-1`}
                >
                  <p
                    className={`text-[10px] tracking-wide uppercase ${getOpacityClass()}`}
                  >
                    {card.label}
                  </p>
                  <p className="text-xl font-medium">{card.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Queries over time chart */}
          {stats && (
            <div className={`rounded-lg p-4 ${cardBg} space-y-3`}>
              <p
                className={`text-xs tracking-wide uppercase ${getOpacityClass()}`}
              >
                Queries — last 30 days
              </p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart
                  data={stats.dailyCounts}
                  margin={{ top: 0, right: 0, left: -28, bottom: 0 }}
                >
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: chartColor, opacity: 0.5 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: string) => {
                      const d = new Date(v + "T00:00:00");
                      return d.getDate() === 1 || d.getDay() === 0
                        ? d.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "";
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: chartColor, opacity: 0.5 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: chartColor, opacity: 0.06 }}
                    labelFormatter={(v) => {
                      const d = new Date(String(v) + "T00:00:00");
                      return d.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill={chartColor}
                    opacity={0.7}
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Peak hours chart */}
          {stats && (
            <div className={`rounded-lg p-4 ${cardBg} space-y-3`}>
              <p
                className={`text-xs tracking-wide uppercase ${getOpacityClass()}`}
              >
                Peak hours (UTC)
              </p>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart
                  data={stats.hourlyCounts}
                  margin={{ top: 0, right: 0, left: -28, bottom: 0 }}
                >
                  <XAxis
                    dataKey="hour"
                    tick={{ fontSize: 10, fill: chartColor, opacity: 0.5 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) =>
                      v % 6 === 0 ? `${String(v).padStart(2, "0")}:00` : ""
                    }
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: chartColor, opacity: 0.5 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: chartColor, opacity: 0.06 }}
                    labelFormatter={(v) =>
                      `${String(v).padStart(2, "0")}:00 UTC`
                    }
                  />
                  <Bar
                    dataKey="count"
                    fill={chartColor}
                    opacity={0.7}
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <hr className={hr} />

          <p className={`text-sm ${getOpacityClass()}`}>
            {total} chatbot {total === 1 ? "query" : "queries"}
          </p>

          {logs.length === 0 && !loading ? (
            <p className={`text-sm ${getOpacityClass()}`}>
              No chatbot queries yet.
            </p>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`space-y-2 rounded-lg p-3 ${cardBg}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-medium">{log.message}</p>
                    <span
                      className={`shrink-0 text-xs whitespace-nowrap ${getOpacityClass()}`}
                    >
                      {new Date(log.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${getOpacityClass()}`}>
                    {log.response.length > 300
                      ? log.response.slice(0, 300) + "…"
                      : log.response}
                  </p>
                  <div
                    className={`flex gap-3 text-[10px] ${getOpacityClass()}`}
                  >
                    {log.ip_address && <span>IP: {log.ip_address}</span>}
                    {log.thread_id && (
                      <span>Thread: {log.thread_id.slice(0, 12)}…</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {loading && (
            <p className={`text-sm ${getOpacityClass()}`}>Loading…</p>
          )}

          {hasMore && !loading && (
            <button
              onClick={handleLoadMore}
              className={`text-sm transition-opacity hover:opacity-60 ${getOpacityClass()}`}
            >
              Load more ({logs.length} of {total})
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
