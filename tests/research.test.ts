import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { getTableConfig } from "drizzle-orm/pg-core";
import { CATEGORIES, CREATION_YEARS, EXTENSIONS, FOLDER_DEPTHS, NAMING_INDICATORS, PHASES, SOURCE, formatNumber, percentage, reportMarkdown, toGiB } from "../src/lib/research";
import { researchNotes } from "../src/db/schema";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { StorageDonut } from "../src/components/research-charts";

test("SVG tooltip titles survive server rendering without hydration gaps", () => {
  const html = renderToStaticMarkup(createElement(StorageDonut, { onExplore() {} }));
  assert.ok(html.includes("<title>Videos: 35.35 GiB (32.58%)</title>"));
  assert.doesNotMatch(html, /<title><\/title>/);
});

test("complete reported category counts reconcile to 617,955", () => assert.equal(CATEGORIES.reduce((sum, item) => sum + item.count, 0), SOURCE.fileCount));
test("complete reported category bytes reconcile exactly", () => assert.equal(CATEGORIES.reduce((sum, item) => sum + item.bytes, 0), SOURCE.totalBytes));
test("all category aggregates are nonnegative safe integers", () => { for (const c of CATEGORIES) { assert.ok(Number.isSafeInteger(c.count) && c.count >= 0); assert.ok(Number.isSafeInteger(c.bytes) && c.bytes >= 0); } });
test("category names are unique and there are twelve", () => { assert.equal(CATEGORIES.length, 12); assert.equal(new Set(CATEGORIES.map(c => c.name)).size, 12); });
test("recalculated storage percentages sum to one hundred", () => assert.ok(Math.abs(CATEGORIES.reduce((sum, c) => sum + percentage(c.bytes, SOURCE.totalBytes), 0) - 100) < 1e-10));
test("binary and decimal storage units are distinguished", () => { assert.equal(toGiB(SOURCE.totalBytes).toFixed(2), "108.50"); assert.equal((SOURCE.totalBytes / 1e9).toFixed(2), "116.50"); assert.equal(toGiB(1073741824), 1); });
test("formatting is locale-stable and zero-denominator safe", () => { assert.equal(formatNumber(617955), "617,955"); assert.equal(percentage(3, 0), 0); assert.equal(percentage(1, 4), 25); });
test("extension excerpt is never expanded into invented records", () => { assert.equal(EXTENSIONS.length, 15); assert.ok(EXTENSIONS.length < SOURCE.extensionCount); assert.ok(EXTENSIONS.reduce((s, c) => s + c.count, 0) < SOURCE.fileCount); });
test("creation timeline leaves unavailable years absent", () => { assert.equal(CREATION_YEARS.length, 16); assert.equal(CREATION_YEARS.find(y => y.year === 2026)?.count, 609375); assert.equal(CREATION_YEARS.find(y => y.year === 2025), undefined); assert.ok(CREATION_YEARS.reduce((s, c) => s + c.count, 0) < SOURCE.fileCount); });
test("folder depth excerpt has only the twenty supplied rows", () => { assert.deepEqual(FOLDER_DEPTHS.map(d => d.depth), Array.from({ length: 20 }, (_, i) => i)); assert.ok(FOLDER_DEPTHS.reduce((s, c) => s + c.count, 0) < SOURCE.folderCount); assert.equal(SOURCE.maxDepth, 23); });
test("naming indicators preserve the reported interpretation caveat", () => { assert.equal(NAMING_INDICATORS.length, 5); assert.match(NAMING_INDICATORS.find(i => i.rule === "R2–R3")!.detail, /not automatically an error/); assert.equal(SOURCE.namingFlags, 105450); });
test("master phase numbering is preserved from zero through ten", () => { assert.deepEqual(PHASES.map(p => p.number), Array.from({ length: 11 }, (_, i) => i)); assert.equal(PHASES[4].title, "Interactive data ingestion"); assert.equal(PHASES[6].title, "Dataset & snapshot comparison"); assert.equal(PHASES[8].title, "Windows portability"); });
test("report output is deterministic", () => assert.equal(reportMarkdown(), reportMarkdown()));
test("report carries provenance and explicit verification limits", () => { const report = reportMarkdown(); assert.match(report, /Not independently re-verified/); assert.match(report, /Candidates|candidates/); assert.match(report, /historical reported evidence/); assert.match(report, /Phases 4–10 remain awaiting/); assert.match(report, /Missing years, extensions, or depths are not filled in/); });
test("report does not expose private source filenames or directory names", () => { const report = reportMarkdown(); assert.doesNotMatch(report, /RAMCO|temple_1500|Frnds Portfolio|D:\\\w/); assert.match(report, /No personal filenames or private directory names/); });
test("notebook schema is separate and has an ownership boundary", () => { const config = getTableConfig(researchNotes); assert.equal(config.name, "workspace_research_notes"); assert.ok(config.columns.some(c => c.name === "workspace_id" && c.notNull)); assert.ok(config.columns.some(c => c.name === "snapshot_id" && c.notNull)); });
test("application exposes no scan or source-modification endpoint", () => { assert.deepEqual(readdirSync("src/app/api").sort(), ["export", "health", "notes"]); for (const route of ["export", "notes"]) { const source = readFileSync(`src/app/api/${route}/route.ts`, "utf8"); assert.doesNotMatch(source, /from ["'](?:node:)?fs|child_process|export async function (?:DELETE|PUT|PATCH)/); } });
