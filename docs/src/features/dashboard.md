# Dashboard

A password-protected analytics dashboard for monitoring chatbot activity in real time.

## Overview

- **Route**: `/dashboard` (not indexed by search engines)
- **Auth**: Bearer token checked against `DASHBOARD_SECRET` environment variable, persisted in `sessionStorage`
- **Data source**: `chatbot_logs` table in Vercel Postgres (Neon)
- **Polling**: Auto-refreshes every 30 seconds; new log entries are prepended without disrupting the view

## Setup

### Environment Variables

```bash
DASHBOARD_SECRET=your-chosen-password
POSTGRES_URL=postgres://...
```

`DASHBOARD_SECRET` is the password used on the sign-in form. It is also used as the Bearer token for all dashboard API requests.

### Database

The dashboard reads from the `chatbot_logs` table created by the database seed script:

```bash
psql "$POSTGRES_URL" -f scripts/setup/seed.sql
```

See [Setup Scripts](../scripts/setup.md) for full details.

## API Endpoints

### `GET /api/dashboard/chatbot-logs`

Returns a paginated list of chatbot interactions.

**Query params**

| Param  | Default | Description           |
| ------ | ------- | --------------------- |
| `page` | `1`     | Page number (1-based) |

**Response**

```json
{
  "logs": [
    {
      "id": 1,
      "message": "What projects have you worked on?",
      "response": "I have worked on...",
      "thread_id": "thread_abc123",
      "ip_address": "1.2.3.4",
      "created_at": "2025-03-17T07:00:00.000Z"
    }
  ],
  "total": 120,
  "page": 1,
  "pageSize": 50
}
```

### `GET /api/dashboard/chatbot-stats`

Returns aggregate analytics computed directly in the database.

**Response**

```json
{
  "totalQueries": 120,
  "uniqueIps": 34,
  "uniqueThreads": 28,
  "avgResponseLength": 842,
  "dailyCounts": [
    { "date": "2025-02-15", "count": 0 },
    { "date": "2025-02-16", "count": 3 }
  ],
  "hourlyCounts": [
    { "hour": 0, "count": 2 },
    { "hour": 1, "count": 0 }
  ]
}
```

`dailyCounts` always contains exactly 30 entries (last 30 days, zero-filled).
`hourlyCounts` always contains exactly 24 entries (hours 0–23 UTC, zero-filled).

Both endpoints return `401 Unauthorized` if the `Authorization: Bearer <token>` header does not match `DASHBOARD_SECRET`.

## UI

### Stat Cards

Four summary cards displayed at the top of the dashboard:

| Card               | Description                                   |
| ------------------ | --------------------------------------------- |
| **Total Queries**  | Total number of chatbot interactions          |
| **Unique IPs**     | Count of distinct IP addresses                |
| **Unique Threads** | Count of distinct conversation threads        |
| **Avg Response**   | Average chatbot response length in characters |

### Charts

Both charts are rendered with [Recharts](https://recharts.org) and adapt to the site's light/dark theme automatically.

**Queries — last 30 days**
Bar chart showing daily query volume for the past 30 days. X-axis labels appear on Sundays and the first of each month to reduce clutter.

**Peak Hours (UTC)**
Bar chart showing query distribution across hours 0–23 UTC (all time).

### Log List

Paginated list of raw chatbot interactions below the charts, ordered by most recent first. Each entry shows:

- User message
- Truncated response (300 chars)
- Timestamp
- IP address (if available)
- Thread ID prefix (if available)

Click **Load more** to append the next page of 50 entries.

### Polling & Manual Refresh

The dashboard polls every **30 seconds**. On each poll:

1. Page 1 of logs is fetched silently — any new entries are **prepended** to the top without resetting the list.
2. All stats and chart data are refreshed.

A **refresh button** (↻) in the top-right corner triggers an immediate manual refresh. The icon spins while a refresh is in progress. The time of the last successful refresh is displayed next to the button.
