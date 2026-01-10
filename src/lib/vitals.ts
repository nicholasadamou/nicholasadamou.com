import { onCLS, onLCP, onFCP, onTTFB, onINP, Metric } from "web-vitals";

/**
 * Report Web Vitals to analytics
 * This function will be called for each Core Web Vital metric
 */
function sendToAnalytics(metric: Metric) {
  // Send to Vercel Analytics (automatically handled by @vercel/speed-insights)
  // You can also send to custom analytics here
  if (process.env.NODE_ENV === "production") {
    // Example: send to Google Analytics
    // window.gtag?.('event', metric.name, {
    //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    //   event_label: metric.id,
    //   non_interaction: true,
    // });

    // Log in development/debugging
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }
}

/**
 * Initialize web vitals tracking
 * Call this in your root layout or _app
 */
export function initWebVitals() {
  if (typeof window === "undefined") return;

  onCLS(sendToAnalytics);
  onLCP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
  onINP(sendToAnalytics);
}
