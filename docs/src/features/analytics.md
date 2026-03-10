# Analytics

Track user behavior and performance with Vercel Analytics and Speed Insights.

## Vercel Analytics

Real user monitoring and page views.

## Speed Insights

Core Web Vitals tracking (LCP, FID, CLS).

## View Tracking

Per-article view tracking via `/api/notes/[slug]/views` with Vercel Postgres.

The `useViews` hook handles both fetching and incrementing:

```typescript
const count = useViews(slug); // GET + POST on mount
const count = useViews(slug, false); // GET only (no increment)
```
