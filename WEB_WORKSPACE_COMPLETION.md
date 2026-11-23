# Digital Archaeology — Web Workspace Completion Report

## 1. Scope, without phase escalation

A functional **separate web companion** was built in the supplied Next.js sandbox. This is not a migration of the original Python/Streamlit project, not a new filesystem collection, and not an execution or sign-off of original-project Phases 4–10.

The initial local repository state and protected-artifact availability are recorded in `BASELINE_REPORT.md`. The original Windows drive, research CSVs, SQLite database, backups, snapshots, and incident evidence were not mounted. None were scanned, opened, recovered, reorganised, overwritten, or deleted. No Git state-changing operation or publication was performed against the original repository.

## 2. Delivered application

### Read-only research presentation

- The eight original research topics are represented: Overview, File Creation Timeline, Storage Analytics, File Type Analysis, Naming Pattern Analysis, Duplicate Analysis, Folder Structure, and Research Findings.
- All figures derive from the supplied aggregate report. They are labeled **reported baseline**, not independently verified local observations.
- The complete 12-category counts and bytes reconcile to the supplied totals. Partial extension, year, depth, and naming excerpts are visibly partial.
- Binary storage units are correctly labeled GiB/KiB, rather than copied from misleading binary “GB/KB” labels.
- Count/storage chart modes, category/extension sorting, extension search, year-range filtering, and explicitly labeled linear/logarithmic timeline scales work.
- Chart tooltips, responsive desktop/mobile layouts, keyboard search, deep links, browser history, focus-trapped dialogs, and mobile navigation are implemented.
- Duplicate candidates remain candidates. Timestamps are not presented as verified authorship or real longitudinal growth.

### Collection, phases, and evidence

- A reported-collection description distinguishes aggregate availability from a mounted or newly registered dataset.
- The master Phase 0–10 numbering is preserved; supplied completion claims for Phases 0–3 are attributed.
- Phases 4–10 remain gated. No scanner, ingestion engine, general analysis engine, two-dataset comparator, Git publisher, or original-project test runner is executed.
- Comparison controls explain the two-dataset and approval prerequisites instead of fabricating a comparison.
- Evidence summaries link to the original public repository and retain historical audit limitations.
- Personal filenames and private directory names from the supplied report are omitted from the application data model and exports.

### Fullstack notebook and exports

- An isolated PostgreSQL table, `workspace_research_notes`, stores append-only annotations through Drizzle.
- Notes persist across reloads and are isolated by unguessable HTTP-only browser-workspace cookies.
- Local HTTP uses SameSite=Strict. Secure embedded previews use Secure, partitioned SameSite=None cookies.
- Cross-site POST requests are rejected. Origin validation accounts for a trusted proxy's forwarded public host. A production proxy must overwrite forwarding headers.
- Validation rejects missing sessions, malformed JSON, invalid note types, oversized inputs, and unsupported update/delete methods.
- Notes do not modify the research data or approve a future phase.
- Deterministic Markdown/JSON/CSV summaries include provenance and uncertainty. Unique download filenames avoid collisions; the browser/user controls the actual destination.
- SVG downloads include visible titles, units, provenance captions, and a storage legend. They contain no executable script.

## 3. Actual verification evidence

| Check | Result | Evidence |
|---|---|---|
| Evidence/unit regression suite | **18 passed; 0 failed** | `evidence-tests.log` |
| Browser/API regression suite | **13 passed; 0 failed** | `browser-tests.log`, `browser-results.json` |
| Total unique automated tests | **31 passed** | Two independent suites above |
| Original eight companion topics render without browser errors | **Passed** | Browser regression test |
| Note persistence and cross-browser isolation | **Passed** | Browser/API regression test |
| Secure cross-site iframe using its own cookie | **Passed** | Stateless HTTPS-origin proxy regression test |
| Cross-site write rejection | **Passed** | API and iframe regression tests |
| SVG export title/units/legend/provenance | **Passed** | Browser download-content test |
| Mobile page overflow and navigation | **Passed** | Browser test at 390 × 844 |
| ESLint | **Passed; no errors or warnings** | `lint.log` |
| `npx next typegen` | **Passed** | `next-typegen.log` |
| `npm exec tsc -- --noEmit --pretty false` | **Passed** | `typescript.log` |
| `npm run build` | **Passed** | `production-build.log` |
| Managed production bootstrap/start and database health | **Passed** | Platform `build_and_start` result |
| Companion aggregate model unchanged by browser testing | **Passed** | Before/after SHA-256 manifests |
| Original protected research artifacts | **Unavailable; not verified** | Baseline report |
| Original 617,955-row naming CSV | **Unavailable; not confirmed locally** | Baseline report |
| Original Python 207-test suite | **Not run** | Outside this workspace and scope |

Final evidence folder: **`artifacts/verification-20261117T105830Z/`**.

Screenshots: `overview-desktop.png` (1440px-wide browser) and `overview-mobile.png` (390px-wide browser). Both layouts were visually reviewed; all eight topic views also underwent automated rendering checks. This is not a visual sign-off of the original Streamlit pages.

The controlled iframe test uses a distinct HTTPS browser origin and a **stateless** local proxy. It verifies that the iframe sends its own cookie, rather than borrowing the parent browser's API session. A direct outbound fetch to the public preview timed out from the sandbox; that network path is not claimed independently verified. Platform-managed startup/health verification passed.

## 4. Integrity evidence and its limits

The **companion's reported aggregate model** (`src/lib/research.ts`) had the same SHA-256 before and after browser interactions:

`d4029c30376a038e43122e7803a24ec0fa402df9b5238f6e2831ce7539e2dd0f`

This is evidence that companion interactions did not modify that model. It is **not** a hash of any original CSV, SQLite archive, snapshot, backup, or protected artifact. Original integrity remains unverified because those files are unavailable.

The earlier supplied “22/22 protected artifacts unchanged” and “207 passed, 1 skipped” results remain historical report claims. They have not been silently reclassified as tests performed here.

Earlier local review/verification bundles are retained in timestamped `artifacts/` folders. Failed diagnostic runs were inspected and corrected, not treated as completion evidence.

## 5. Issues found and resolved during verification

1. Chromium required missing sandbox system libraries; the browser prerequisites were installed before live tests were accepted.
2. SVG tooltip titles initially rendered differently on server and client. Single-string SVG titles resolved the hydration mismatch, with a dedicated server-rendering regression test.
3. Startup loader state updates were refactored into abortable completion callbacks; URL state uses React's external-store subscription. Lint passes without suppressing the rule.
4. A truly isolated embedded-preview test exposed forwarded-origin handling behind a proxy. The API now checks the forwarded public host, rejects cross-site requests, and passes the permanent iframe regression.
5. The keyboard test was synchronized to the actual application startup request instead of racing global listener installation.
6. Next.js and its ESLint configuration were updated through the package installer to the non-breaking 16.4.6 security patch. The last dependency installation reported **12 moderate advisories**, down from 13. Remaining advisories still require review before release.

## 6. Modified and created files

### Modified starter files

- `src/app/page.tsx` — companion entrypoint.
- `src/app/layout.tsx` — research metadata and application layout.
- `src/app/globals.css` — complete responsive visual system.
- `src/db/schema.ts` — separate append-only notebook table.
- `package.json` and generated `package-lock.json` — tool-managed dependencies and security patch; no manual package-manifest edits.

The existing `src/db/index.ts`, `/api/health` implementation, and platform database configuration remain in place.

### Created application files

- `src/components/workspace.tsx`
- `src/components/research-views.tsx`
- `src/components/research-charts.tsx`
- `src/lib/research.ts`
- `src/lib/chart-export.ts`
- `src/app/api/notes/route.ts`
- `src/app/api/export/route.ts`
- `src/app/icon.svg`
- `public/fonts/inter-regular.ttf`
- `public/fonts/inter-semibold.ttf`
- `public/fonts/inter-bold.ttf`
- `public/fonts/OFL.txt`

### Created tests, safeguards, and documentation

- `tests/research.test.ts`
- `tests/workspace.spec.ts`
- `playwright.config.ts`
- `.gitignore`
- `README.md`
- `BASELINE_REPORT.md`
- `WEB_WORKSPACE_COMPLETION.md`
- Timestamped, gitignored `artifacts/` screenshots, logs, and integrity manifests.
- `workspace-inventory.json` in the final evidence folder records companion filenames and byte sizes; it excludes secrets and dependency/build directories.

No original Python source, original dashboard page, research dataset, database, snapshot, backup, incident evidence, or original report was modified.

## 7. Boundaries that remain

- Original-project outputs are restricted by policy to `D:\Data VMini`; this separate sandbox cannot enforce a Windows save dialog's destination.
- No raw dataset is mounted; per-file filtering, fresh dataset registration, ingestion, comparison, and new statistical findings are not claimed.
- Browser-scoped notes are not authenticated multiuser accounts or a durable backup. Clearing the cookie loses access. Keep sensitive paths, secrets, and private research data out of this preview.
- Existing dependency advisories, a full security audit, private-artifact integrity verification, original Python regression, Windows portability validation, and publication review remain separate work.
- No remote repository changes, publication, or original-project phase approvals are performed by the application.

**Stopped at the companion's verified scope. Original-project Phases 4–10 await explicit approval.**
