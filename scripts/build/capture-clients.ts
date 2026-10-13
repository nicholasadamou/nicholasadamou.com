import { chromium } from "playwright";
import sharp from "sharp";
import { clients } from "../../src/lib/content/clients";

const browser = await chromium.launch();
try {
  for (const client of clients) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    try {
      await page.goto(client.href, { waitUntil: "networkidle", timeout: 60000 });
      await page.locator("main h1").first().waitFor({ state: "visible" });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(Array.from(document.images).filter(image => image.getBoundingClientRect().top < innerHeight).map(image => image.decode()));
      });
      // Hydrated animation libraries can start after the page load event.
      await page.waitForTimeout(3000);
      await page.evaluate(() => document.getAnimations().forEach(animation => {
        if (animation.effect?.getTiming().iterations !== Infinity) animation.finish();
      }));
      await page.waitForFunction(() => {
        let element: Element | null = document.querySelector("main h1");
        while (element) {
          if (Number(getComputedStyle(element).opacity) < 0.95) return false;
          element = element.parentElement;
        }
        return true;
      });
      await sharp(await page.screenshot({ animations: "disabled" })).webp({ quality: 85 }).toFile(`public/images/clients/${client.slug}.webp`);
      console.log(`Captured ${client.name}`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
