# Digital Archaeology — Web Workspace Baseline

## Scope and approval boundary

This report concerns the separate Next.js web workspace provided for this task. It is **not** a baseline integrity attestation for the Windows research project and does not supersede any supplied audit. No approval to execute original-project Phases 4–10 is inferred. Phase numbering remains 0–10.

The workspace is a presentation companion: eight research topics, reported aggregate visualizations, a read-only evidence library, a phase plan, and append-only notes in a separate PostgreSQL database. It does not implement or execute the original project's ingestion, analysis, recovery, or comparison engines.

## Initial local inventory

The initial tool inventory contained 13 files:

- `eslint.config.mjs`
- `postcss.config.mjs`
- `package.json`
- `drizzle.config.json`
- `tsconfig.json`
- `.env` (filename observed; values not printed)
- `next.config.ts`
- `src/app/page.tsx`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/db/index.ts`
- `src/db/schema.ts`
- `src/app/api/health/route.ts`

Existing implementation: Next.js App Router, React, Tailwind, PostgreSQL through Drizzle, and a database health endpoint. The schema entrypoint was empty. No local test files appeared in that initial inventory.

No Python entrypoint, Streamlit dashboard, research CSV, SQLite research database, source-drive snapshot, recovery backup, incident evidence, or protected-file hash manifest was present in the local inventory. The original drive is not mounted or connected to the application.

## Linked repository inspection

Read-only HTTP requests inspected:

- https://github.com/ArulAgnes/DIGITAL_ARCHAEOLOGY
- https://raw.githubusercontent.com/ArulAgnes/DIGITAL_ARCHAEOLOGY/main/docs/PHASE_3_IMPLEMENTATION.md

The repository was reachable and populated. The public Phase 3 implementation notes describe read-only adapters, processing contexts, isolated outputs, and deferred functionality. The older supplied audit's empty-remote observation is therefore historical, not current.

These reads did not initialize, clone, stage, commit, push, publish, execute repository code, or modify the original repository. A default-branch documentation read is not a pinned-source or whole-repository security audit.

## Reported research inventory (not independently verified)

| Artifact / measurement | Reported evidence | Local verification |
|---|---:|---|
| File records | 617,955 | Original dataset unavailable |
| Folder records | 59,213 | Original dataset unavailable |
| Apparent storage | 116,500,257,509 bytes | Arithmetic presentation only |
| Naming-analysis rows | 617,955 | Cannot confirm original rows locally |
| Unique extensions | 281 | Original dataset unavailable |
| Protected Phase 3 artifacts | 22 | Not mounted; no fresh integrity hashes |
| Original regression tests | 207 passed, 1 skipped | Historical supplied result, not rerun |
| Recorded scan errors | 19 NotFound events | Source error log unavailable |

The local presentation model includes 12 complete category aggregates, 15 extension rows from a truncated table, 16 displayed/explicitly reported creation-year values, 20 of 24 folder-depth rows, and five selected naming indicators. These are supplied research aggregates, **not** new filesystem records or invented findings.

The complete category counts and bytes can be checked arithmetically. Such checks do not establish original dataset authenticity or integrity. Storage uses GiB for binary units, GB for decimal units. Category percentages are recalculated from reported bytes; inconsistent percentages in other report excerpts are not copied as authoritative.

## Protected-file inventory and initial integrity evidence

**Protected original artifacts available to hash: none.** No original artifact was hashed, opened, restored, or rewritten. A missing local copy is not evidence of absence on the researcher's computer. Original SHA-256, size, and mtime gates are unavailable, not passed. No digest is invented.

Protected original locations remain the source D: drive, research data, SQLite archive, snapshots, reports, backups, logs, and incident evidence described in the supplied reports. Their integrity must be independently verified on the original machine before future approved phases.

## Write and privacy boundaries

- The original `D:\` source volume is read-only by research policy and inaccessible from this application.
- The original project's approved output location remains `D:\Data VMini`.
- Web application source and platform build/test outputs live in the supplied sandbox, not the Windows project.
- The separate `workspace_research_notes` PostgreSQL table contains optional browser-scoped annotations, not original research data. Only insert and select endpoints exist.
- Notes are isolated using an unguessable HTTP-only, SameSite=Strict browser cookie. This is not an authenticated multiuser identity system. Clearing the cookie loses access. Do not store secrets or rely on this preview as the only archive.
- Export endpoints perform no server-side filesystem writes. Downloads have unique filenames. The browser/user controls the destination; the application cannot enforce a Windows save directory.
- Personal filenames and private directory names from the supplied report are deliberately omitted from the presentation and export model.
- The application has no scanner, document reader, content-hashing endpoint, destructive database rebuild, source-file edit, move, rename, delete, Git mutation, or publication endpoint.

## Safety checklist

- [x] Inspect local repository before implementation.
- [x] Distinguish public repository inspection from original artifact verification.
- [x] Preserve supplied Phase 0–10 numbering.
- [x] Keep original Python/Streamlit architecture untouched.
- [x] Provide all eight original research topics in the companion navigation.
- [x] Identify supplied aggregates as reported and unverified locally.
- [x] Never fill missing years, depths, or extensions with fabricated observations.
- [x] Treat duplicate candidates as candidates, not confirmed duplicates.
- [x] Do not run the historical test suite that previously clobbered research data.
- [x] Do not collect new filesystem research metadata.
- [x] Do not initiate original-project Phases 4–10.
- [ ] Recompute original protected-file hashes — blocked: original artifacts unavailable.
- [ ] Confirm the original 617,955-row naming CSV — blocked: original dataset unavailable.
- [ ] Independently run all original Python tests — outside this workspace/scope.

## New verification suite

`tests/research.test.ts` checks aggregate arithmetic, units, determinism, table boundaries, phase ordering, notebook schema separation, and source-access surface. `tests/workspace.spec.ts` exercises the eight topic views, filters, charts, phase gates, exports, dialogs, notebook persistence and isolation, API validation, and the mobile layout. These tests are separate from the original 207-test Python result. Completion evidence is recorded only after execution.

## Dependency risk

The initial application dependency audit after tool-managed installation reported 13 moderate advisories, 0 high, and 0 critical. Affected chains included Next.js, Drizzle tooling, esbuild tooling, and ESLint/transitive packages. No automatic force upgrade was applied. This preview is not claimed publication-ready or security-audited; dependency review is a release gate.
