import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:3000";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
let failed = 0;
const ok = (m) => console.log("PASS  " + m);
const bad = (m, e) => { console.log("FAIL  " + m + " :: " + (e?.message || e)); failed++; };

try {
  // 1. Available unit shows Reserve
  await page.goto(`${BASE}/unit/T1-12A`, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: /Reserve with/ }).first().click();
  await page.waitForURL(/\/book/, { timeout: 10000 });
  ok("unit available -> reserve opens booking flow");

  // 2. Complete booking
  await page.getByPlaceholder("As per PAN").fill("Test Buyer");
  await page.getByPlaceholder("10-digit mobile").fill("9876543210");
  await page.getByPlaceholder("ABCDE1234F").fill("ABCDE1234F");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByPlaceholder("6-digit code").fill("123456");
  await page.getByRole("button", { name: /Verify/ }).click();
  await page.getByRole("button", { name: /Pay .* via UPI/ }).click();
  await page.getByText("Flat reserved!").waitFor({ timeout: 8000 });
  ok("EOI paid -> booking confirmed");

  // 3. My Home shows the real booking (data flow)
  await page.goto(`${BASE}/my-home`, { waitUntil: "networkidle" });
  await page.getByText("Welcome back, Test").waitFor({ timeout: 8000 });
  await page.getByText("T1-12A").first().waitFor({ timeout: 8000 });
  ok("My Home reflects the new booking (T1-12A, Test)");

  // 4. Unit page now shows booked
  await page.goto(`${BASE}/unit/T1-12A`, { waitUntil: "networkidle" });
  await page.getByText(/booked/i).first().waitFor({ timeout: 8000 });
  ok("unit page now shows booked (status propagated)");

  // 5. Admin activity reflects it
  await page.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
  await page.getByText(/T1-12A/).first().waitFor({ timeout: 8000 });
  ok("admin cockpit activity reflects the booking");

  // 6. Pay outstanding in My Home -> ledger updates
  await page.goto(`${BASE}/my-home/demand`, { waitUntil: "networkidle" });
  const payBtn = page.getByRole("button", { name: /Pay .* now/ });
  if (await payBtn.count()) {
    await payBtn.first().click();
    await page.getByText(/Payment received|No dues right now/).first().waitFor({ timeout: 8000 });
    ok("paying a demand updates the ledger (dues cleared)");
    // Emil toast fires on the action
    if (await page.getByText(/Payment received:/).count()) ok("toast confirms the payment");
  } else {
    ok("no outstanding to pay (already clear)");
  }

  // 7. Shortlist: save a flat -> it shows on /shortlist
  await page.goto(`${BASE}/unit/T1-12A`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /^Save$|^Saved$/ }).first().click();
  await page.goto(`${BASE}/shortlist`, { waitUntil: "networkidle" });
  await page.getByText("T1-12A").first().waitFor({ timeout: 8000 });
  ok("shortlist saves a flat and shows it on /shortlist");

  // 8. Site visit scheduler
  await page.goto(`${BASE}/visit?u=T2-14A`, { waitUntil: "networkidle" });
  await page.getByPlaceholder("Full name").fill("Visit Tester");
  await page.getByPlaceholder("10-digit mobile").fill("9811122233");
  await page.locator('input[type="date"]').fill("2026-08-15");
  await page.getByRole("button", { name: "Request visit" }).click();
  await page.getByText("Visit requested").waitFor({ timeout: 8000 });
  ok("site-visit scheduler books a visit");
} catch (e) {
  bad("flow", e);
}

await browser.close();
console.log(failed === 0 ? "\nE2E: ALL PASSED" : `\nE2E: ${failed} FAILED`);
process.exit(failed);
