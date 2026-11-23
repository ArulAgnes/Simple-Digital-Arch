export const SOURCE = {
  name: "Original D: collection",
  id: "20261116_002517",
  reportedAt: "2026-11-16T00:31:35",
  collectedAt: "2026-11-16T00:25:17",
  finishedAt: "2026-11-16T00:26:32",
  provenance: "User-supplied research report and Phase 3 implementation report. Not independently re-verified in this workspace.",
  repository: "https://github.com/ArulAgnes/DIGITAL_ARCHAEOLOGY",
  fileCount: 617955,
  folderCount: 59213,
  totalBytes: 116500257509,
  extensionCount: 281,
  maxDepth: 23,
  averageDepth: 8.586,
  emptyFolders: 3426,
  zeroByteFiles: 5124,
  errorCount: 19,
  duplicateCandidates: 78790,
  namingFlags: 105450,
} as const;

export type Category = { name: string; count: number; bytes: number; color: string };
export const CATEGORIES: Category[] = [
  { name: "Programming", count: 410877, bytes: 5019082329, color: "#b9613e" },
  { name: "Other", count: 189646, bytes: 21051164414, color: "#97a88b" },
  { name: "Images", count: 12669, bytes: 17807584889, color: "#d4a45c" },
  { name: "Documents", count: 1988, bytes: 465757790, color: "#b5a6ba" },
  { name: "Executables", count: 1209, bytes: 12727871246, color: "#b9c6b5" },
  { name: "Archives", count: 631, bytes: 20931216045, color: "#d18867" },
  { name: "Spreadsheets", count: 403, bytes: 234393093, color: "#90aba6" },
  { name: "Datasets", count: 198, bytes: 12091676, color: "#89a0b7" },
  { name: "System-related", count: 166, bytes: 49656221, color: "#aaafa3" },
  { name: "Audio", count: 100, bytes: 181932061, color: "#b4b79b" },
  { name: "Presentations", count: 37, bytes: 62179457, color: "#c4b092" },
  { name: "Videos", count: 31, bytes: 37957328288, color: "#3d594c" },
];

export const EXTENSIONS = [
  { name: ".mkv", count: 10, bytes: 28400267127 },
  { name: ".jpg", count: 7324, bytes: 16277263586 },
  { name: ".zip", count: 216, bytes: 16177570324 },
  { name: ".mp4", count: 21, bytes: 9557061161 },
  { name: ".exe", count: 519, bytes: 7781560037 },
  { name: ".dll", count: 570, bytes: 4521166569 },
  { name: ".iso", count: 1, bytes: 4140924928 },
  { name: ".asar", count: 7, bytes: 3898505884 },
  { name: ".sst", count: 4489, bytes: 2684474578 },
  { name: ".js", count: 174064, bytes: 2374945149 },
  { name: ".node", count: 79, bytes: 1962109952 },
  { name: ".map", count: 69119, bytes: 1695151013 },
  { name: ".pth", count: 33, bytes: 1555507981 },
  { name: ".png", count: 4590, bytes: 1428053187 },
  { name: ".py", count: 77993, bytes: 1315844735 },
];

// These are the displayed rows and explicitly reported peak, not an invented complete time series.
export const CREATION_YEARS = [
  { year: 1996, count: 73 }, { year: 2002, count: 2 }, { year: 2005, count: 1 },
  { year: 2006, count: 4 }, { year: 2007, count: 21 }, { year: 2008, count: 7 },
  { year: 2009, count: 1 }, { year: 2010, count: 3 }, { year: 2014, count: 4 },
  { year: 2019, count: 28 }, { year: 2020, count: 162 }, { year: 2021, count: 2 },
  { year: 2022, count: 250 }, { year: 2023, count: 141 }, { year: 2024, count: 251 },
  { year: 2026, count: 609375 },
];
export const FOLDER_DEPTHS = [1, 60, 97, 210, 2284, 6420, 6818, 7423, 8256, 7985, 6595, 3811, 2788, 2114, 1769, 1093, 663, 382, 189, 133].map((count, depth) => ({ depth, count }));
export const NAMING_INDICATORS = [
  { rule: "R1", name: "Version indicator", count: 633, detail: "A version-like marker in the filename." },
  { rule: "R2–R3", name: "Final / latest keyword", count: 79, detail: "An indicator, not automatically an error." },
  { rule: "R4", name: "Date indicator", count: 8614, detail: "A filename date pattern, not a verified authoring date." },
  { rule: "R5", name: "Copy indicator", count: 1984, detail: "A copy-like naming pattern; not proof of duplicate content." },
  { rule: "R7", name: "Mixed capitalisation", count: 102875, detail: "A naming characteristic, not proof of poor organisation." },
];

export const PHASES = [
  { number: 0, title: "Baseline & safety", short: "Baseline", description: "Establish the repository inventory, protected artifacts, and research boundaries.", deliverables: ["BASELINE_REPORT.md", "Repository inventory", "Protected-file inventory", "Initial integrity evidence", "Safety checklist"] },
  { number: 1, title: "Audit & R1 recovery", short: "Audit & recovery", description: "Recover only evidence-supported original data and isolate the leaking test.", deliverables: ["PHASE_1_AUDIT.md", "R1 recovery report", "Dataset integrity report", "Regression test report"] },
  { number: 2, title: "Repository safety audit", short: "Repository safety", description: "Classify private metadata and prepare a publication-safe inclusion manifest.", deliverables: ["Repository safety audit", "Proposed .gitignore", "Public/private classification", "Publication readiness report"] },
  { number: 3, title: "Reusable dataset architecture", short: "Dataset architecture", description: "Independent dataset identities, provenance, read-only adapters, and isolated output contexts.", deliverables: ["Dataset architecture", "Schema documentation", "Dataset registry", "Validation tests", "Architecture report"] },
  { number: 4, title: "Interactive data ingestion", short: "Data ingestion", description: "Controlled metadata collection with permission handling, progress, and cancellation.", deliverables: ["Ingestion engine", "Collection configuration", "Dataset registration workflow", "Ingestion tests", "Collection report"] },
  { number: 5, title: "General analysis engine", short: "Analysis engine", description: "Reproducible descriptive statistics for independently registered metadata datasets.", deliverables: ["Analysis engine", "Statistical reports", "Reusable metrics", "Validation tests", "Research interpretation"] },
  { number: 6, title: "Dataset & snapshot comparison", short: "Dataset comparison", description: "Mode B comparisons with independent provenance and explicit unmatched records.", deliverables: ["Two-dataset comparison engine", "Comparison reports", "Comparison metrics", "Regression tests"] },
  { number: 7, title: "Advanced visualization dashboard", short: "Advanced visualization", description: "Extend, rather than replace, the original eight research pages.", deliverables: ["Advanced dashboard", "Visualization catalogue", "Chart documentation", "Screenshot evidence", "Test report"] },
  { number: 8, title: "Windows portability", short: "Windows portability", description: "Safe Windows paths, Unicode filenames, repeatable setup, and inaccessible-drive handling.", deliverables: ["Windows setup scripts", "Dependency configuration", "Portability tests", "Execution guide"] },
  { number: 9, title: "Documentation & GitHub presentation", short: "Documentation", description: "Document methodology, privacy, installation, and reproducibility without private metadata.", deliverables: ["Professional README", "Research methodology", "System architecture", "Installation and usage guides", "Privacy and limitations"] },
  { number: 10, title: "Final validation & publication", short: "Final validation", description: "Independent integrity, privacy, and reproducibility review. Publishing requires separate approval.", deliverables: ["FINAL_VALIDATION_REPORT.md", "Privacy audit", "Test evidence", "Reproducibility report", "GitHub publication checklist"] },
] as const;

export const RESEARCH_QUESTION = "What can the structure of our accumulated digital files reveal about how our work evolves?";
export const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);
export const toGiB = (bytes: number) => bytes / 1024 ** 3;
export const percentage = (value: number, total: number) => total === 0 ? 0 : value / total * 100;
export function reportMarkdown() {
  return `# Digital Archaeology — reported baseline\n\n> ${RESEARCH_QUESTION}\n\n## Provenance\n${SOURCE.provenance}\n\nSnapshot: ${SOURCE.id}\nSource report generated: ${SOURCE.reportedAt} (local timezone unspecified).\nRepository: ${SOURCE.repository}\n\n## Collection\n- Files: ${formatNumber(SOURCE.fileCount)}\n- Folders: ${formatNumber(SOURCE.folderCount)}\n- Storage: ${SOURCE.totalBytes} bytes (${toGiB(SOURCE.totalBytes).toFixed(2)} GiB; ${(SOURCE.totalBytes / 1e9).toFixed(2)} GB)\n- Extensions: ${SOURCE.extensionCount}\n- Recorded errors: ${SOURCE.errorCount} (reported NotFound events)\n\n## File categories\n| Category | Files | Bytes | Storage share |\n|---|---:|---:|---:|\n${CATEGORIES.map(c => `| ${c.name} | ${c.count} | ${c.bytes} | ${percentage(c.bytes, SOURCE.totalBytes).toFixed(2)}% |`).join("\n")}\n\n## Evidence boundaries\n- These figures are supplied report aggregates, not a locally inspected dataset.\n- The original D: drive and Python project are not mounted in this web workspace.\n- No source document was opened and no source drive was scanned by this application.\n- Duplicate candidates are not verified duplicates. Content hashing is not implemented.\n- Timestamps do not establish original authorship; this is one cross-sectional snapshot.\n- Some source tables are truncated. Missing years, extensions, or depths are not filled in.\n- The report's binary 'GB' values are labeled GiB here; shares are recalculated from reported bytes.\n- Phase 3's 207 passed / 1 skipped and 22/22 integrity results are historical reported evidence, not tests run here.\n- Phases 4–10 remain awaiting explicit approval.\n\n## Privacy\nNo personal filenames or private directory names are included in this export.\nThis application does not save exports to the source drive; choose an approved destination when downloading.\n`;
}
