# Digital Archaeology · Research Workspace

A separate, read-only web companion to [ArulAgnes/DIGITAL_ARCHAEOLOGY](https://github.com/ArulAgnes/DIGITAL_ARCHAEOLOGY).

> What can the structure of our accumulated digital files reveal about how our work evolves?

## Scope

This Next.js application presents aggregates from the user-supplied research and audit reports. It does **not** replace, migrate, or modify the original Python/Streamlit project. It does not have access to the original Windows drive or protected research artifacts.

All eight original research topics are represented: Overview, File Creation Timeline, Storage Analytics, File Type Analysis, Naming Pattern Analysis, Duplicate Analysis, Folder Structure, and Research Findings. Additional companion views provide a collection description, the unchanged Phase 0–10 plan, reports/evidence, and a separate research notebook.

**Phases 4–10 are not approved or executed by this application.** A note is neither a phase approval nor an independently verified research finding.

## Evidence and visualization

- Reported snapshot: `20261116_002517`.
- Reported totals: 617,955 files, 59,213 folders, 116,500,257,509 bytes.
- Source: supplied research report, with public architecture documentation inspected read-only.
- Category aggregates reconcile arithmetically to the supplied totals. This does not prove source-dataset authenticity.
- Truncated extension, creation-year, folder-depth, and naming tables remain explicitly partial.
- Storage is labeled GiB for binary units; percentages are computed from supplied byte counts.
- Duplicate matches are candidates, never confirmed duplicates.
- One snapshot does not establish actual growth, authorship, or verified projects.
- No private filenames or private directory names are included in the aggregate presentation.

Interactive controls include file-count/storage chart modes, category and extension sorting, extension search, creation-year ranges, explicitly labeled logarithmic/linear scales, chart hover values, command search (Ctrl/Cmd+K), expandable phases, and mobile navigation.

Markdown, JSON, and CSV exports retain provenance and limitations. SVG exports include a title, units, evidence caption, and a legend where needed. Export contents are deterministic for the selected source/presentation; filenames are uniquely timestamped to avoid collisions. The browser controls save location—choose the original approved project output directory when using these as research outputs.

## Stack and local setup

- Next.js App Router and React
- TypeScript and Tailwind/global CSS
- Locally hosted Inter font assets and Lucide icons
- PostgreSQL through Drizzle ORM
- Node test runner through `tsx`, and Playwright/Chromium

Configure `DATABASE_URL` in the local `.env` file. Do not commit secrets. Install dependencies using `npm install`. Once the local PostgreSQL service is available, apply `src/db/schema.ts` using `npx drizzle-kit push`. The platform-managed preview handles bootstrap/build/start; for local development use `npm run dev`.

The only new table is `workspace_research_notes`, independent of the original SQLite research database. The existing platform database client and `/api/health` endpoint are retained.

## API and persistence

| Endpoint | Purpose | Mutability |
|---|---|---|
| `GET /api/health` | PostgreSQL connectivity | Read only |
| `GET /api/notes` | Establish browser scope; list up to 100 recent notes | No research-data writes |
| `POST /api/notes` | Add a validated annotation | Append-only workspace table |
| `GET /api/export?format=md` | Attributed baseline summary | No server-side file writes |
| `GET /api/export?format=json` | Aggregates, provenance, partial-table markers | Read only |
| `GET /api/export?format=csv&section=categories` | Available rows; sections also include extensions, timeline, folders, naming | Read only |

Notes have a stable UUID, browser-workspace UUID, snapshot identifier, title, body, kind, and creation time. There are no PUT/PATCH/DELETE handlers. Drizzle parameterizes database operations. Validation rejects oversized inputs and arbitrary note kinds. Cross-site POST requests are explicitly rejected; origin checks compare against the trusted proxy's public `X-Forwarded-Host`, falling back to `Host`. A deployment proxy must overwrite forwarding headers rather than blindly trust client-supplied values. The browser suite verifies a distinct HTTPS-origin iframe with a stateless proxy, not an inherited parent session.

An unguessable HTTP-only cookie scopes each browser's notes. Local HTTP uses SameSite=Strict. HTTPS uses Secure, partitioned SameSite=None cookies to support embedded previews; cross-origin POST checks remain enforced. Partitioning may give different top-level sites separate workspaces. Clearing browser cookies loses access. This is not an authenticated multiuser system, durable backup, or approved store for secrets/private filesystem paths.

## Research safety

The original source `D:\` remains inaccessible/read-only. Original outputs are restricted by research policy to `D:\Data VMini`; this sandbox is a separate application environment. The web app cannot verify or enforce a Windows download destination.

No original document contents are opened; no filesystem scan, hashing, recovery, file edit, rename, move, delete, database rebuild, Git initialization, commit, push, or publication is performed. Original artifacts, tests, snapshots, backups, and reports are untouched. Protected-file hashes cannot be verified without those artifacts.

See `BASELINE_REPORT.md` for the inspected initial state and explicit verification gaps. Generated screenshots are kept in timestamped, gitignored `artifacts/` folders. `.gitignore` is a safeguard, not a substitute for a staged-file privacy review.

## Reproducible checks

1. `npx tsx --test tests/research.test.ts` — aggregate arithmetic, source boundaries, units, phase numbering, deterministic export text, separate schema, and server-rendered SVG regression.
2. `npx playwright install --with-deps chromium` — browser prerequisites.
3. With the production preview running: `npx playwright test` — research views, filters, exports, dialogs, phase gates, notebook persistence/isolation, API validation, and mobile layout.
4. `npx next typegen`
5. `npm exec tsc -- --noEmit --pretty false`
6. `npm run build`
7. Platform-managed `build_and_start` and `/api/health` verification.

Optional test environment settings: `DA_TEST_BASE_URL` (default localhost port 3000) and `DA_EVIDENCE_DIR` (use a fresh directory for each screenshot run). Browser output lives under `/tmp/da-playwright-results`; test runs do not execute the original project's Python tests.

## Release limitations

The reported original 207 passed / 1 skipped and 22/22 protected-artifact results are historical evidence—not the tests run here. The original 617,955-row naming dataset cannot be independently confirmed from a pasted aggregate report. There is no mounted raw dataset, dataset registration engine, ingestion engine, two-dataset comparison engine, user authentication, or publication workflow in this companion.

Next.js received the non-breaking 16.4.6 security patch during implementation. Remaining dependency advisories must be reviewed before any public deployment; this application does not claim publication or security sign-off. No changes are pushed to the linked repository.
