import { test, expect } from "@playwright/test";
import { mkdir, readFile } from "node:fs/promises";

const evidenceDir = process.env.DA_EVIDENCE_DIR;

test("overview uses attributed metrics and interactive charts", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Research overview", exact: true })).toBeVisible();
  await expect(page.getByText("Reported baseline", { exact: true })).toBeVisible();
  await expect(page.getByText("617,955", { exact: true })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  if (evidenceDir) { await mkdir(evidenceDir, { recursive: true }); await page.screenshot({ path: `${evidenceDir}/overview-desktop.png`, fullPage: true }); }
  await page.getByRole("button", { name: "Storage", exact: true }).click();
  await expect(page.getByRole("img", { name: "Selected reported extensions by storage in GiB" })).toBeVisible();
  await page.getByRole("button", { name: "Files", exact: true }).click();
  await expect(page.getByRole("img", { name: "Selected reported extensions by file count" })).toBeVisible();
  await page.getByRole("button", { name: "Explore dataset", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Your research collection" })).toBeVisible();
  await expect(page.getByText("Report aggregates only", { exact: true })).toBeVisible();
});

test("all original eight research topics render without browser errors", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  const views = [["Overview", "Research overview"], ["Creation timeline", "File creation timeline"], ["Storage analytics", "Storage analytics"], ["File type analysis", "File type analysis"], ["Naming patterns", "Naming pattern analysis"], ["Duplicate analysis", "Duplicate analysis"], ["Folder structure", "Folder structure"], ["Research findings", "Research findings"]];
  for (const [label, title] of views) { await page.getByRole("navigation", { name: "Main navigation" }).getByRole("button", { name: label, exact: true }).click(); await expect(page.getByRole("heading", { level: 1, name: title, exact: true })).toBeVisible(); }
  expect(errors).toEqual([]);
});

test("extension filtering, sort, empty state, and table download work", async ({ page }) => {
  await page.goto("/#filetypes");
  await page.getByRole("textbox", { name: "Filter extensions" }).fill(".py");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("77,993");
  await page.getByLabel("Sort extensions").selectOption("bytes");
  await page.getByRole("textbox", { name: "Filter extensions" }).fill("not-present");
  await expect(page.getByRole("heading", { name: "No matching extensions" })).toBeVisible();
  await page.getByRole("button", { name: "Clear filter" }).click();
  await expect(page.locator("tbody tr")).toHaveCount(15);
  const downloadPromise = page.waitForEvent("download"); await page.getByRole("link", { name: "Export available rows" }).click();
  const download = await downloadPromise; expect(download.suggestedFilename()).toMatch(/^digital-archaeology-extensions-\d+\.csv$/);
});

test("timeline filters do not manufacture missing years", async ({ page }) => {
  await page.goto("/#timeline");
  await page.getByLabel("Filter creation years").selectOption("recent");
  await expect(page.getByText("6 reported years shown")).toBeVisible();
  await expect(page.locator(".horizontal-bar-name", { hasText: "2025" })).toHaveCount(0);
  await page.getByRole("button", { name: "Use linear scale" }).click();
  await expect(page.getByText("Linear bar lengths · number of files")).toBeVisible();
  await page.getByRole("button", { name: "Use log scale" }).click();
  await expect(page.getByText("Logarithmic bar lengths · log₁₀(count + 1)")).toBeVisible();
});

test("command search and browser history navigate the workspace", async ({ page }) => {
  const startupReady = page.waitForResponse(response => new URL(response.url()).pathname === "/api/notes" && response.request().method() === "GET");
  await page.goto("/"); await startupReady;
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("textbox", { name: "Search pages" }).fill("naming"); await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1, name: "Naming pattern analysis" })).toBeVisible();
  await page.goBack(); await expect(page.getByRole("heading", { level: 1, name: "Research overview" })).toBeVisible();
});

test("phase plan retains approval gates and original numbering", async ({ page, request }) => {
  await page.goto("/#phases"); await expect(page.locator(".phase-item")).toHaveCount(11);
  await page.locator(".phase-item-heading").filter({ hasText: "Interactive data ingestion" }).click();
  await expect(page.getByText("Explicit approval is required before implementation. Recording a note does not approve or start this phase.")).toBeVisible();
  await expect(page.getByText("Awaiting approval", { exact: true })).toBeVisible();
  expect((await request.post("/api/scan")).status()).toBe(404);
  await page.getByRole("navigation").getByRole("button", { name: "Datasets", exact: true }).click();
  await page.getByRole("button", { name: "Compare datasets" }).click();
  await expect(page.getByRole("heading", { name: "Comparison starts with two collections." })).toBeVisible();
});

test("safety dialog traps focus, closes on Escape, and restores the trigger", async ({ page }) => {
  await page.goto("/"); const trigger = page.getByRole("button", { name: "Read-only source" }); await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText("Observe metadata only", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).focus(); await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("button", { name: "Close dialog" })).toBeFocused();
  await page.keyboard.press("Escape"); await expect(page.getByRole("dialog")).toHaveCount(0); await expect(trigger).toBeFocused();
});

test("all export formats retain evidence limits and reject invalid formats", async ({ page, request }) => {
  const first = await request.get("/api/export?format=md"); const second = await request.get("/api/export?format=md");
  expect(first.status()).toBe(200); expect(await first.text()).toBe(await second.text()); expect(await first.text()).toContain("Not independently re-verified");
  const json = await (await request.get("/api/export?format=json")).json(); expect(json.source.fileCount).toBe(617955); expect(json.originalFilesAccessed).toBe(false); expect(json.partialTables).toContain("creationYearsExcerpt");
  const csv = await request.get("/api/export?format=csv&section=categories"); expect((await csv.text()).trim().split("\n")).toHaveLength(13);
  expect((await request.get("/api/export?format=xml")).status()).toBe(400); expect((await request.get("/api/export?format=csv&section=unknown")).status()).toBe(400);
  await page.goto("/"); await page.getByRole("button", { name: "Export report", exact: true }).click(); await page.getByRole("button", { name: /Structured evidence/ }).click();
  const downloaded = page.waitForEvent("download"); await page.getByRole("button", { name: "Download JSON" }).click(); expect((await downloaded).suggestedFilename()).toMatch(/\.json$/);
  await expect(page.getByRole("status")).toContainText("Export prepared");
});

test("append-only notes persist, validate input, and isolate browser workspaces", async ({ page, browser }) => {
  await page.goto("/#notebook"); await expect(page.getByRole("heading", { name: "Every observation starts somewhere." })).toBeVisible();
  const title = `Workspace verification ${Date.now()}`;
  await page.getByRole("button", { name: "Add research note", exact: true }).click(); await page.getByLabel("Title", { exact: true }).fill(title);
  await page.getByLabel("Your note", { exact: true }).fill("Test-only workspace annotation. No source files or research datasets are changed.");
  await page.getByRole("button", { name: "Save research note" }).click(); await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
  await page.reload(); await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
  const invalid = await page.request.post("/api/notes", { data: { title: "", body: "invalid", kind: "observation" } }); expect(invalid.status()).toBe(400);
  const badOrigin = await page.request.post("/api/notes", { headers: { origin: "https://not-this-workspace.invalid" }, data: { title: "x", body: "x", kind: "observation" } }); expect(badOrigin.status()).toBe(403);
  expect((await page.request.put("/api/notes", { data: {} })).status()).toBe(405); expect((await page.request.delete("/api/notes")).status()).toBe(405);
  const other = await browser.newContext(); const otherPage = await other.newPage(); await otherPage.goto(`${page.url().split("#")[0]}#notebook`);
  await expect(otherPage.getByRole("heading", { name: "Every observation starts somewhere." })).toBeVisible(); await expect(otherPage.getByRole("heading", { name: title, exact: true })).toHaveCount(0); await other.close();
});

test("exported storage SVG contains visible units, legend, and provenance", async ({ page }) => {
  await page.goto("/#storage");
  await page.getByRole("button", { name: "Export report", exact: true }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export chart (SVG)" }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).not.toBeNull();
  const contents = await readFile(path!, "utf8");
  expect(contents).toContain("Storage composition · GiB and share of total");
  expect(contents).toContain("108.50 GiB");
  expect(contents).toContain("Remaining types");
  expect(contents).toContain("Not locally re-verified");
  expect(contents).not.toContain("<script");
});

test("notes API rejects unauthenticated, malformed, and oversized writes", async ({ request }) => {
  expect((await request.post("/api/notes", { data: { title: "No session", body: "Test", kind: "observation" } })).status()).toBe(401);
  const opened = await request.get("/api/notes");
  expect(opened.status()).toBe(200);
  expect(opened.headers()["set-cookie"]).toContain("HttpOnly");
  expect((await request.post("/api/notes", { data: "not json", headers: { "Content-Type": "application/json" } })).status()).toBe(400);
  expect((await request.post("/api/notes", { data: { title: "Test", body: "x", kind: "approval" } })).status()).toBe(400);
  expect((await request.post("/api/notes", { data: { title: "Test", body: "x".repeat(19000), kind: "observation" } })).status()).toBe(413);
  const unchanged = await (await request.get("/api/notes")).json();
  expect(unchanged.notes).toHaveLength(0);
});

test("secure cross-site preview uses its own cookie behind a trusted proxy", async ({ page, context }) => {
  let secureCookieSeen = false;
  let iframeCookieSeen = false;
  const upstream = process.env.DA_TEST_BASE_URL || "http://127.0.0.1:3000";
  await context.route("https://secure-preview.test/**", async route => {
    const request = route.request();
    const url = new URL(request.url());
    const headers: Record<string, string> = { ...await request.allHeaders(), host: "secure-preview.test", "x-forwarded-host": "secure-preview.test", "x-forwarded-proto": "https" };
    if (url.pathname === "/api/notes" && request.method() === "POST" && headers.cookie?.includes("da_workspace=")) iframeCookieSeen = true;
    // Stateless Node transport: never borrow the parent browser's localhost cookie jar.
    const response = await fetch(upstream + url.pathname + url.search, { method: request.method(), headers, body: ["GET", "HEAD"].includes(request.method()) ? undefined : request.postData(), signal: AbortSignal.timeout(15000) });
    const cookie = (response.headers.get("set-cookie") || "").toLowerCase();
    if (["httponly", "secure", "partitioned", "samesite=none"].every(attribute => cookie.includes(attribute))) secureCookieSeen = true;
    const outgoingHeaders = Object.fromEntries(response.headers);
    delete outgoingHeaders["content-encoding"]; delete outgoingHeaders["content-length"]; delete outgoingHeaders["transfer-encoding"];
    await route.fulfill({ status: response.status, headers: outgoingHeaders, body: Buffer.from(await response.arrayBuffer()) });
  });
  await page.goto("/");
  await page.evaluate(() => { const iframe = document.createElement("iframe"); iframe.src = "https://secure-preview.test/#notebook"; iframe.id = "secure-preview-check"; iframe.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:999999;background:white"; document.body.append(iframe); });
  const frame = page.frameLocator("#secure-preview-check");
  await expect(frame.getByRole("heading", { name: "Every observation starts somewhere." })).toBeVisible();
  await frame.getByRole("button", { name: "Add research note", exact: true }).click();
  const title = `Secure iframe verification ${Date.now()}`;
  await frame.getByLabel("Title", { exact: true }).fill(title);
  await frame.getByLabel("Your note", { exact: true }).fill("Test-only isolated browser annotation. No original research data is accessed.");
  await frame.getByRole("button", { name: "Save research note" }).click();
  await expect(frame.getByRole("heading", { name: title, exact: true })).toBeVisible();
  expect(secureCookieSeen).toBe(true); expect(iframeCookieSeen).toBe(true);
  const crossSite = await page.request.post("/api/notes", { headers: { origin: "https://evil.test", "x-forwarded-host": "evil.test", "sec-fetch-site": "cross-site" }, data: { title: "Rejected", body: "Cross-site write attempt", kind: "observation" } });
  expect(crossSite.status()).toBe(403);
});

test("mobile layout has no horizontal page overflow and navigation works", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto("/"); await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole("heading", { name: "Research overview" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  if (evidenceDir) { await mkdir(evidenceDir, { recursive: true }); await page.screenshot({ path: `${evidenceDir}/overview-mobile.png`, fullPage: true }); }
  await page.getByRole("button", { name: "Open navigation" }).click(); await page.getByRole("navigation").getByRole("button", { name: "Duplicate analysis", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Duplicate analysis" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Close navigation" })).toHaveCount(0);
});
