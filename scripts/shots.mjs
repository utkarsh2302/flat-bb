import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:3000";
const OUT = "/private/tmp/claude-501/-Users-brickbytes-Desktop-flat-bb-final/0231138a-d490-444b-8400-aeba6ce18421/scratchpad/shots";

const targets = [
  ["home", "/"],
  ["explore", "/explore"],
  ["tower", "/explore/T1"],
  ["unit", "/unit/T1-12A"],
  ["cost", "/unit/T1-12A/cost-sheet"],
  ["project", "/project/crimson"],
  ["broker", "/broker"],
  ["admin", "/admin"],
  ["progress", "/progress"],
  ["myhome", "/my-home"],
];

const viewports = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

const browser = await chromium.launch();
for (const [vpName, vp] of Object.entries(viewports)) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 2, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const [name, url] of targets) {
    try {
      await page.goto(BASE + url, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(700);
      await page.screenshot({ path: `${OUT}/${name}-${vpName}.png`, fullPage: false });
      if (name === "home") {
        await page.screenshot({ path: `${OUT}/${name}-${vpName}-full.png`, fullPage: true });
      }
      console.log(`ok  ${name}-${vpName}`);
    } catch (e) {
      console.log(`FAIL ${name}-${vpName}: ${e.message}`);
    }
  }
  await ctx.close();
}
await browser.close();
console.log("done");
