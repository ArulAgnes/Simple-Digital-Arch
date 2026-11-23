"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { ArrowDownToLine, ArrowRight, ArrowUpRight, BookOpen, CalendarDays, ChartNoAxesCombined, Check, ChevronDown, ChevronRight, ChevronsUpDown, CircleHelp, Command, Database, Ellipsis, FileCheck2, FileJson2, FileSpreadsheet, FileText, Fingerprint, FolderTree, GitBranch, HardDrive, Info, Layers3, LayoutDashboard, LoaderCircle, LockKeyhole, Menu, MessageSquareText, Plus, Search, ShieldCheck, Sparkles, Tags, X, type LucideIcon } from "lucide-react";
import { SOURCE } from "@/lib/research";
import { EvidenceNote, ResearchView, type Dialog, type View } from "./research-views";

type NavItem = { id: View; label: string; title: string; description: string; icon: LucideIcon };
const NAV: NavItem[] = [
  { id: "overview", label: "Overview", title: "Research overview", description: "A closer look at the structure of your digital work.", icon: LayoutDashboard },
  { id: "datasets", label: "Datasets", title: "Your research collection", description: "One original collection. Clear boundaries and traceable provenance.", icon: Database },
  { id: "phases", label: "Research phases", title: "The research journey", description: "A considered path from a safe baseline to reproducible research.", icon: GitBranch },
  { id: "timeline", label: "Creation timeline", title: "File creation timeline", description: "Trace the timestamps in the archive, without assuming an authoring history.", icon: CalendarDays },
  { id: "storage", label: "Storage analytics", title: "Storage analytics", description: "Understand the difference between how many files and how much space.", icon: HardDrive },
  { id: "filetypes", label: "File type analysis", title: "File type analysis", description: "Explore the formats that make up your digital collection.", icon: ChartNoAxesCombined },
  { id: "naming", label: "Naming patterns", title: "Naming pattern analysis", description: "The small choices in filenames can leave measurable patterns.", icon: Tags },
  { id: "duplicates", label: "Duplicate analysis", title: "Duplicate analysis", description: "Understand metadata matches without confusing candidates with proof.", icon: Fingerprint },
  { id: "folders", label: "Folder structure", title: "Folder structure", description: "Look beneath the surface of the directory hierarchy.", icon: FolderTree },
  { id: "findings", label: "Research findings", title: "Research findings", description: "What the reported evidence reveals—and what it leaves open.", icon: Sparkles },
  { id: "reports", label: "Reports & evidence", title: "Reports & evidence", description: "Keep the methodology, evidence, and limitations in the same place.", icon: FileText },
  { id: "notebook", label: "Research notebook", title: "Your research notebook", description: "A separate space for observations, questions, and careful interpretation.", icon: BookOpen },
];

type Note = { id: string; title: string; body: string; kind: string; snapshotId: string; createdAt: string };

function Github({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.82c.85 0 1.71.11 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>;
}

function BrandMark() {
  return <svg width="36" height="40" viewBox="0 0 40 44" fill="none" aria-hidden="true"><path d="m4 26 16 9 16-9v7L20 42 4 33Z" fill="#d8a389"/><path d="m4 17 16 9 16-9v7L20 33 4 24Z" fill="#c57b59"/><path d="m4 10 16-9 16 9-16 9Z" fill="#ba6240"/><path d="m4 10 16 9 16-9v6l-16 9L4 16Z" fill="#a95032"/><path d="m12 10 8-4 8 4-8 4Z" fill="#f8eee4"/></svg>;
}

function Modal({ title, eyebrow, children, onClose, wide = false }: { title: string; eyebrow?: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () => Array.from(ref.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), textarea, select, [tabindex="0"]') || []);
    const timer = setTimeout(() => { const autoFocus = ref.current?.querySelector<HTMLElement>("[data-autofocus]"); (autoFocus || focusable()[0])?.focus(); }, 30);
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const elements = focusable(); const first = elements[0]; const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => { clearTimeout(timer); document.removeEventListener("keydown", onKey); document.body.style.overflow = overflow; previous?.focus(); };
  }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}><div className={`modal ${wide ? "modal-wide" : ""}`} role="dialog" aria-modal="true" aria-labelledby={id} ref={ref}><div className="modal-heading"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2 id={id}>{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={20}/></button></div>{children}</div></div>;
}

function SafetyContent() {
  return <div className="modal-body"><div className="dialog-hero-icon"><ShieldCheck size={27} strokeWidth={1.5}/></div><p className="dialog-intro">Research should reveal structure, not disturb it.</p><div className="principle-list">{[["01", "Observe metadata only", "Names, timestamps, sizes, and directory structure—not document contents. This web application has no filesystem scanning or content-hashing endpoint."], ["02", "Leave the source untouched", "The original D: drive is not mounted here. No source files are modified, renamed, moved, deleted, or reorganised."], ["03", "Keep outputs separate", "The original project’s approved output boundary is D:\\Data VMini. Web notes are stored separately in this preview’s PostgreSQL database. Downloads require you to choose an approved destination."], ["04", "Preserve evidence and uncertainty", "No original artifact is overwritten. Supplied results are labeled as reported; candidates are not confirmed duplicates, and missing data is never invented."], ["05", "Stop at the approval gate", "Phases 4–10 are not executed. No Git initialization, commit, push, or publication is performed by this application."]].map(([number, title, detail]) => <div className="principle" key={number}><span>{number}</span><div><h3>{title}</h3><p>{detail}</p></div></div>)}</div></div>;
}

function subscribeToNavigation(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener("hashchange", onChange);
  window.addEventListener("da:navigate", onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("da:navigate", onChange);
  };
}
function browserView(): View {
  return NAV.find(item => item.id === window.location.hash.slice(1))?.id || "overview";
}
function serverView(): View { return "overview"; }

export default function Workspace() {
  const view = useSyncExternalStore(subscribeToNavigation, browserView, serverView);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [notesError, setNotesError] = useState("");
  const [noteFilter, setNoteFilter] = useState("all");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [noteKind, setNoteKind] = useState("observation");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [exportFormat, setExportFormat] = useState("md");
  const [exportSection, setExportSection] = useState("categories");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [toast, setToast] = useState("");
  const active = NAV.find(item => item.id === view)!;
  const closeDialog = useCallback(() => setDialog(null), []);
  const showToast = useCallback((message: string) => setToast(message), []);
  const loadNotes = useCallback(async () => {
    try { const response = await fetch("/api/notes", { cache: "no-store" }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Could not load your notebook."); setNotes(data.notes); setNotesError(""); }
    catch (error) { setNotesError(error instanceof Error ? error.message : "The notebook could not be loaded."); }
    finally { setNotesLoading(false); }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/notes", { cache: "no-store", signal: controller.signal })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load your notebook.");
        return data.notes as Note[];
      })
      .then(entries => { if (!controller.signal.aborted) setNotes(entries); })
      .catch(error => { if (!controller.signal.aborted) setNotesError(error instanceof Error ? error.message : "The notebook could not be loaded."); })
      .finally(() => { if (!controller.signal.aborted) setNotesLoading(false); });
    function onKey(e: KeyboardEvent) { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setDialog(current => current === "search" ? null : "search"); setSearch(""); } }
    window.addEventListener("keydown", onKey);
    return () => { controller.abort(); window.removeEventListener("keydown", onKey); };
  }, []);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(""), 5000); return () => clearTimeout(timer); }, [toast]);

  const navigate = useCallback((next: View) => {
    setMobileNav(false); setDialog(null);
    window.history.pushState(null, "", `#${next}`);
    window.dispatchEvent(new Event("da:navigate"));
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  const openDialog = useCallback((next: Dialog) => { setFormError(""); setExportError(""); if (next === "search") setSearch(""); setDialog(next); }, []);

  async function saveNote(event: FormEvent) {
    event.preventDefault(); setSaving(true); setFormError("");
    try {
      const session = await fetch("/api/notes", { cache: "no-store" });
      if (!session.ok) throw new Error("The notebook is temporarily unavailable. Your draft has been kept.");
      const response = await fetch("/api/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: noteTitle, body: noteBody, kind: noteKind }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Could not save your note.");
      const prior = await session.json(); setNotes([data.note, ...prior.notes]); setNotesError("");
      setNoteTitle(""); setNoteBody(""); setNoteKind("observation"); navigate("notebook"); showToast("Research note saved. Original research data remains untouched.");
    } catch (error) { setFormError(error instanceof Error ? error.message : "The note could not be saved. Your draft has been kept."); }
    finally { setSaving(false); }
  }

  async function downloadReport() {
    setExporting(true); setExportError("");
    try {
      const response = await fetch(`/api/export?format=${exportFormat}&section=${exportSection}`);
      if (!response.ok) throw new Error("The export could not be generated. Please try again.");
      const blob = await response.blob(); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `digital-archaeology-${exportFormat === "csv" ? exportSection : "baseline"}-${Date.now()}.${exportFormat}`; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      closeDialog(); showToast("Export prepared. Keep it inside your approved output directory.");
    } catch (error) { setExportError(error instanceof Error ? error.message : "Export failed. Please try again."); }
    finally { setExporting(false); }
  }

  async function exportChart() {
    const chart = document.querySelector<SVGSVGElement>(".page-content .file-bar-chart, .page-content .donut-wrap svg, .page-content .depth-chart svg");
    if (!chart) return;
    setExporting(true); setExportError("");
    try {
      const { serializeChart } = await import("@/lib/chart-export");
      const url = URL.createObjectURL(new Blob([serializeChart(chart)], { type: "image/svg+xml" }));
      const a = document.createElement("a"); a.href = url; a.download = `digital-archaeology-chart-${Date.now()}.svg`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      closeDialog(); showToast("Chart exported with its title, units, and evidence provenance.");
    } catch { setExportError("The chart could not be exported. Please try again."); }
    finally { setExporting(false); }
  }

  function navItem(item: NavItem) {
    return <button key={item.id} className={`nav-item ${view === item.id ? "active" : ""}`} onClick={() => navigate(item.id)} aria-current={view === item.id ? "page" : undefined} title={item.title}><item.icon size={17} strokeWidth={1.65}/><span>{item.label}</span>{item.id === "phases" && <span className="nav-count">03</span>}{item.id === "notebook" && notes.length > 0 && <span className="nav-count">{notes.length}</span>}</button>;
  }

  const matchingNav = NAV.filter(item => `${item.label} ${item.title} ${item.description}`.toLowerCase().includes(search.toLowerCase().trim()));
  const shownNotes = notes.filter(note => noteFilter === "all" || note.kind === noteFilter);

  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Skip to research content</a>
    {mobileNav && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)}/>}
    <aside className={`sidebar ${mobileNav ? "is-open" : ""}`}><button className="brand" onClick={() => navigate("overview")} aria-label="Digital Archaeology home"><BrandMark/><span>Digital<br/><strong>Archaeology<span className="brand-period">.</span></strong></span></button><button className="workspace-switch" onClick={() => openDialog("workspace")}><span className="workspace-avatar"><Layers3 size={17}/></span><span><strong>Personal research</strong><small>Metadata research workspace</small></span><ChevronsUpDown size={14}/></button><nav aria-label="Main navigation"><span className="nav-section-label">WORKSPACE</span>{NAV.slice(0, 3).map(navItem)}<span className="nav-section-label analysis-label">ANALYSIS</span>{NAV.slice(3, 10).map(navItem)}<div className="nav-divider"/>{NAV.slice(10).map(navItem)}</nav><div className="sidebar-bottom"><div className="sidebar-safety"><ShieldCheck size={19} strokeWidth={1.5}/><strong>Curiosity, without compromise.</strong><p>Only metadata. Your original<br/>files stay just as they are.</p><button onClick={() => openDialog("safety")}>Our safety principles <ArrowUpRight size={12}/></button></div><button className="profile-button" onClick={() => openDialog("workspace")}><span className="profile-avatar">AA</span><span><strong>Arul Agnes</strong><small>Research workspace</small></span><Ellipsis size={18}/></button></div></aside>
    <div className="main-shell"><header className="topbar"><div className="breadcrumb"><button className="icon-button mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={20}/></button><span className="breadcrumb-workspace">Workspace</span><ChevronRight size={13}/><span>{active.label}</span></div><div className="topbar-actions"><button className="search-trigger" onClick={() => openDialog("search")} aria-label="Search workspace"><Search size={15}/><span>Search workspace</span><kbd>⌘ K</kbd></button><span className="topbar-divider"/><button className="readonly-status" onClick={() => openDialog("safety")}><span className="status-dot"/>Read-only source</button><button className="icon-button help-button" onClick={() => openDialog("methodology")} aria-label="Research methodology and help"><CircleHelp size={18}/></button><a className="icon-button github-link" href={SOURCE.repository} target="_blank" rel="noreferrer" aria-label="Open original GitHub repository"><Github size={19}/></a></div></header>
    <main className="page-content" id="main-content"><div className="page-heading"><div><div className="page-title-row"><h1>{active.title}</h1>{view === "overview" && <span className="baseline-label"><span/>Reported baseline</span>}</div><p>{active.description}</p></div><div className="page-actions">{view !== "notebook" && <button className="button export-button" onClick={() => openDialog("export")}><ArrowDownToLine size={15}/>Export report</button>}{view === "overview" ? <button className="button button-primary" onClick={() => navigate("datasets")}>Explore dataset <ArrowUpRight size={15}/></button> : <button className="button button-primary" onClick={() => openDialog("note")}><Plus size={15}/>Add research note</button>}</div></div>
    {view === "overview" && <div className="collection-context"><button onClick={() => openDialog("source")}><Database size={14}/><strong>Original D: collection</strong><ChevronDown size={13}/></button><span className="context-divider"/><span><CalendarDays size={13}/>16 Nov 2026</span><span className="context-spacer"/><span className="metadata-label"><ShieldCheck size={13}/>Metadata only. Always.</span></div>}
    <div className="view-content" key={view}>{view === "notebook" ? <div className="view-stack"><div className="notebook-context"><ShieldCheck size={16}/><p>Notes are saved in this browser’s separate web workspace. They never modify the original research dataset. Avoid private filenames or personal paths.</p></div><div className="section-toolbar"><div className="segmented notebook-filters">{["all", "observation", "question", "methodology"].map(kind => <button key={kind} className={noteFilter === kind ? "selected" : ""} onClick={() => setNoteFilter(kind)}>{kind === "all" ? "All notes" : kind === "observation" ? "Observations" : kind === "question" ? "Questions" : "Methodology"}</button>)}</div><span className="small-muted">{notes.length} saved {notes.length === 1 ? "note" : "notes"} · append-only</span></div>{notesLoading ? <div className="empty-state panel"><LoaderCircle size={25} className="spin"/><h2>Opening your notebook…</h2></div> : notesError ? <div className="empty-state panel"><Info size={28}/><h2>Your notebook is unavailable</h2><p>{notesError}</p><button className="button" onClick={() => void loadNotes()}>Try again</button></div> : !shownNotes.length ? <div className="empty-state panel"><span className="empty-state-icon"><BookOpen size={33} strokeWidth={1.3}/></span><span className="eyebrow">A SPACE FOR THOUGHTFUL RESEARCH</span><h2>{notes.length ? "No notes in this category yet." : "Every observation starts somewhere."}</h2><p>Capture a pattern, question an assumption, or document a decision.<br/>Your notes stay separate from the evidence.</p><button className="button button-primary" onClick={() => openDialog("note")}><Plus size={15}/>Write your first {noteFilter === "all" ? "note" : noteFilter}</button></div> : <div className="notes-grid">{shownNotes.map(note => <article className="panel note-card" key={note.id}><div className="note-meta"><span className={`note-kind ${note.kind}`}><MessageSquareText size={12}/>{note.kind}</span><time dateTime={note.createdAt}>{new Date(note.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</time></div><h2>{note.title}</h2><p>{note.body}</p><div className="note-card-footer"><Database size={12}/><span>Original collection</span><LockKeyhole size={11}/><span>Preserved entry</span></div></article>)}</div>}<EvidenceNote>Browser-scoped notes are not part of the protected dataset or an approval record. Clearing the workspace cookie loses access to these notes. Up to 100 most recent entries are shown. Do not use this preview as your only research archive.</EvidenceNote></div> : <ResearchView view={view} navigate={navigate} openDialog={openDialog}/>}</div>
    <footer className="workspace-footer"><span>Digital Archaeology<span className="footer-dot">·</span>Understanding the evolution of digital work</span><span>Observe. Understand. Preserve.</span></footer></main></div>

    {dialog === "search" && <Modal title="Find your way around" eyebrow="WORKSPACE SEARCH" onClose={closeDialog}><div className="search-modal-body"><label className="command-search"><Search size={20}/><input data-autofocus value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && matchingNav[0]) navigate(matchingNav[0].id); }} placeholder="Search pages, reports, or analysis…" aria-label="Search pages"/><kbd>esc</kbd></label><div className="command-results">{matchingNav.length ? matchingNav.map(item => <button key={item.id} onClick={() => navigate(item.id)}><item.icon size={19}/><span><strong>{item.title}</strong><small>{item.description}</small></span><ArrowUpRight size={15}/></button>) : <div className="search-no-results"><Search size={24}/><h3>No matching pages</h3><p>Try “storage”, “phases”, or “notebook”.</p></div>}</div><div className="command-footer"><span><Command size={12}/> K to open anywhere</span><span>Enter to open the first result</span></div></div></Modal>}

    {dialog === "safety" && <Modal title="Care is part of the methodology." eyebrow="OUR SAFETY PRINCIPLES" onClose={closeDialog}><SafetyContent/></Modal>}

    {dialog === "methodology" && <Modal title="Observe. Don’t disturb." eyebrow="RESEARCH METHODOLOGY" onClose={closeDialog}><div className="modal-body"><p className="dialog-intro">A metadata-only approach to understanding accumulated digital work.</p><div className="method-steps"><div><span><Database size={20}/></span><h3>01 · Collect structure</h3><p>The original report describes filesystem metadata collection using directory enumeration and stat calls. Symlinks were not followed, hidden files were included, and 19 NotFound events were reported.</p></div><div><span><ChartNoAxesCombined size={20}/></span><h3>02 · Describe, don’t infer</h3><p>Counts, byte totals, extension groups, naming indicators, and timestamp distributions describe this single snapshot. They do not verify authorship, intention, file contents, or change over time.</p></div><div><span><FileCheck2 size={20}/></span><h3>03 · Preserve provenance</h3><p>This companion renders aggregates from the supplied report. It does not run the original pipeline or claim to have revalidated its 617,955 rows. Categories sum to the reported totals; truncated tables remain partial.</p></div></div><EvidenceNote>Windows creation timestamps may reflect copying or restoration, not original authorship. Metadata-level duplicate candidates are not confirmed duplicates. Hashing would read file contents and is not implemented here.</EvidenceNote><a className="button repository-button" href={`${SOURCE.repository}/blob/main/docs/ARCHITECTURE.md`} target="_blank" rel="noreferrer"><Github size={16}/>Read the original architecture <ArrowUpRight size={14}/></a></div></Modal>}

    {dialog === "source" && <Modal title="Know where the numbers come from." eyebrow="COLLECTION PROVENANCE" onClose={closeDialog}><div className="modal-body"><div className="source-status"><Info size={19}/><span><strong>Reported baseline · not locally re-verified</strong><p>These figures were provided in your research and implementation reports.</p></span></div><dl className="detail-list"><div><dt>Collection</dt><dd>Original D: collection</dd></div><div><dt>Snapshot identifier</dt><dd className="mono">{SOURCE.id}</dd></div><div><dt>Reported collection time</dt><dd>16 Nov 2026 · 00:25:17–00:26:32</dd></div><div><dt>Timezone</dt><dd>Not specified in the supplied report</dd></div><div><dt>Reported file records</dt><dd>617,955</dd></div><div><dt>Reported folder records</dt><dd>59,213</dd></div><div><dt>Reported storage</dt><dd>116,500,257,509 bytes</dd></div><div><dt>Source dataset mounted here</dt><dd>No</dd></div><div><dt>Fresh integrity hashes</dt><dd>Unavailable—not invented</dd></div></dl><h3 className="dialog-subheading">A clear separation of evidence</h3><p className="dialog-copy">The Phase 3 report states that 207 tests passed, 1 was skipped, and 22 protected artifacts were unchanged. These are historical claims from that report, not validation runs performed in this web workspace.</p><p className="dialog-copy">The public repository was reachable and populated at inspection. This differs from the older Phase 2 audit’s empty-remote description. The original Python dashboard and its eight pages have not been edited.</p><a className="button repository-button" href={SOURCE.repository} target="_blank" rel="noreferrer"><Github size={16}/>View original repository <ArrowUpRight size={14}/></a></div></Modal>}

    {dialog === "export" && <Modal title="Take the evidence with you." eyebrow="EXPORT REPORTED BASELINE" onClose={closeDialog}><div className="modal-body"><p className="dialog-copy">A deterministic summary of the supplied aggregates, including provenance and limitations. No private filenames or directory names are included.</p><div className="export-options">{([{ id: "md", label: "Research summary", detail: "Markdown · readable and reproducible", icon: FileText }, { id: "json", label: "Structured evidence", detail: "JSON · aggregates and provenance", icon: FileJson2 }, { id: "csv", label: "Data table", detail: "CSV · available reported rows only", icon: FileSpreadsheet }] as const).map(option => <button className={exportFormat === option.id ? "selected" : ""} key={option.id} onClick={() => setExportFormat(option.id)} aria-pressed={exportFormat === option.id}><option.icon size={21}/><span><strong>{option.label}</strong><small>{option.detail}</small></span><span className="radio-circle">{exportFormat === option.id && <span/>}</span></button>)}</div>{exportFormat === "csv" && <label className="form-label">Table to export<select value={exportSection} onChange={e => setExportSection(e.target.value)}><option value="categories">All reported file categories</option><option value="extensions">Reported extension excerpt</option><option value="timeline">Reported creation-year excerpt</option><option value="folders">Reported folder-depth excerpt</option><option value="naming">Reported naming indicators</option></select></label>}<div className="output-reminder"><LockKeyhole size={16}/><span><strong>Choose your approved output directory</strong><p>Save project outputs inside <code>D:\Data VMini</code>. Your browser controls the destination; this app cannot enforce it. Each export gets a unique filename.</p></span></div>{exportError && <p className="form-error" role="alert">{exportError}</p>}<div className="modal-actions">{["overview", "filetypes", "storage", "folders"].includes(view) ? <button className="button" onClick={exportChart}>Export chart (SVG)</button> : <button className="button" onClick={closeDialog}>Cancel</button>}<button className="button button-primary" disabled={exporting} onClick={() => void downloadReport()}>{exporting ? <LoaderCircle size={16} className="spin"/> : <ArrowDownToLine size={16}/>}Download {exportFormat.toUpperCase()}</button></div></div></Modal>}

    {dialog === "note" && <Modal title="Leave a thoughtful observation." eyebrow="NEW RESEARCH NOTE" onClose={closeDialog}><form className="modal-body note-form" onSubmit={saveNote}><p className="dialog-copy">An append-only note in the separate web workspace. Not a dataset change, research finding, or phase approval.</p><label className="form-label">Note type<select value={noteKind} onChange={e => setNoteKind(e.target.value)}><option value="observation">Observation</option><option value="question">Research question</option><option value="methodology">Methodology / review</option></select></label><label className="form-label">Title<input data-autofocus value={noteTitle} onChange={e => setNoteTitle(e.target.value)} placeholder="Give your observation a clear title" maxLength={120} required/></label><label className="form-label">Your note<textarea value={noteBody} onChange={e => setNoteBody(e.target.value)} placeholder="What did you notice? What evidence supports it? What is still uncertain?" rows={6} maxLength={4000} required/></label><div className="form-hint"><span><LockKeyhole size={12}/>Avoid private paths and personal information.</span><span>{noteBody.length.toLocaleString()} / 4,000</span></div>{formError && <p className="form-error" role="alert">{formError}</p>}<div className="modal-actions"><button type="button" className="button" onClick={closeDialog}>Keep as draft</button><button className="button button-primary" type="submit" disabled={saving || !noteTitle.trim() || !noteBody.trim()}>{saving ? <LoaderCircle size={16} className="spin"/> : <Plus size={16}/>}Save research note</button></div></form></Modal>}

    {dialog === "comparison" && <Modal title="Comparison starts with two collections." eyebrow="PHASE 06 · APPROVAL REQUIRED" onClose={closeDialog}><div className="modal-body"><div className="dialog-hero-icon"><GitBranch size={28}/></div><p className="dialog-intro">One snapshot is an observation.<br/>Two independent snapshots can reveal change.</p><p className="dialog-copy">Only one reported collection is available here. The comparison engine belongs to Phase 6 of the master plan and has not been implemented or executed by this workspace.</p><div className="comparison-requirements"><span><LockKeyhole size={15}/>Explicit approval for the phase</span><span><Database size={15}/>Two independently registered, validated datasets</span><span><FileCheck2 size={15}/>Preserved provenance and unmatched-record reporting</span></div><div className="modal-actions"><button className="button" onClick={closeDialog}>Back to collection</button><button className="button button-primary" onClick={() => navigate("phases")}>Review the phase plan <ArrowRight size={15}/></button></div></div></Modal>}

    {dialog === "audit" && <Modal title="Preserve the incident, not just the fix." eyebrow="PROJECT AUDIT · SUPPLIED EVIDENCE" onClose={closeDialog}><div className="modal-body"><p className="dialog-intro">The initial audit documented real risks in the original Python project.</p><div className="principle-list"><div className="principle"><span>R1</span><div><h3>A test overwrote the naming dataset</h3><p>The supplied audit reports 617,955 naming rows replaced by 4 fixture rows. Recovery required test isolation and verified original data. The later Phase 3 report states the regression and integrity gates passed.</p></div></div><div className="principle"><span>R2</span><div><h3>A stale-resume scan clobbered outputs</h3><p>The historical report describes recovery from SQLite and preserved clobber evidence. Some nested metadata was reconstructed rather than recovered. That uncertainty must remain disclosed.</p></div></div><div className="principle"><span>R3+</span><div><h3>Unsafe defaults and publication risks</h3><p>The audits identify whole-drive scan defaults, a destructive database builder, private paths, loose dependency pins, and visual-verification gaps. Phase 3 reports an explicit scan gate and isolated output contexts; this workspace does not execute the original tools.</p></div></div></div><EvidenceNote>The original test suite was not run here. Without the actual protected artifacts, no local recovery, row validation, or integrity result can be claimed.</EvidenceNote></div></Modal>}

    {dialog === "phase2" && <Modal title="Private evidence. Public methodology." eyebrow="PHASE 02 · REPOSITORY SAFETY" onClose={closeDialog}><div className="modal-body"><p className="dialog-intro">The supplied Phase 2 audit separates publishable source code from private research artifacts.</p><div className="classification-columns"><div><h3><Check size={15}/>Proposed public</h3><p>Application source, isolated tests, requirements, a data dictionary, and reviewed documentation.</p></div><div><h3><LockKeyhole size={15}/>Must remain private</h3><p>Raw and processed data, databases, snapshots, logs, backups, incident evidence, and reports containing personal paths.</p></div></div><h3 className="dialog-subheading">Important historical boundaries</h3><p className="dialog-copy">The report describes a proposed default-deny .gitignore, a 40-file inclusion manifest, and no Git state-changing operations during that phase. Its statement that the remote was empty is historical; the linked repository is now populated.</p><EvidenceNote>No privacy re-audit of all remote files, dependency pinning, Git initialization, commit, or publication was performed in this workspace. A supplied secret-scan result is not a fresh secret scan.</EvidenceNote></div></Modal>}

    {dialog === "phase3" && <Modal title="A reusable foundation, with boundaries." eyebrow="PHASE 03 · REPORTED IMPLEMENTATION" onClose={closeDialog}><div className="modal-body"><div className="reported-test-grid"><div><strong>207</strong><span>tests reported passed</span></div><div><strong>1</strong><span>test reported skipped</span></div><div><strong>22 / 22</strong><span>artifacts reported intact</span></div></div><p className="dialog-copy">The implementation report describes a stable dataset model, CSV and read-only SQLite adapters, an isolated filesystem wrapper, a descriptor-only registry, and explicit scan opt-in.</p><h3 className="dialog-subheading">Documented limitations remain visible</h3><ul className="dialog-list"><li>Folder cancellation was supported only before scan start.</li><li>The analysis CLI and full Mode B pipeline were deferred.</li><li>Dependency pinning was proposed, not applied in that phase.</li><li>All eight dashboard pages had import checks, not full visual verification.</li></ul><EvidenceNote>These numbers are quoted from the supplied Phase 3 report. They are not tests executed or protected-file hashes recomputed by this application.</EvidenceNote><a className="button repository-button" href={`${SOURCE.repository}/blob/main/docs/PHASE_3_IMPLEMENTATION.md`} target="_blank" rel="noreferrer"><Github size={16}/>Read repository implementation notes <ArrowUpRight size={14}/></a></div></Modal>}

    {dialog === "workspace" && <Modal title="A companion to your original research." eyebrow="ABOUT THIS WORKSPACE" onClose={closeDialog}><div className="modal-body"><div className="workspace-about-brand"><BrandMark/><strong>Digital Archaeology<span>.</span></strong></div><p className="dialog-intro">A clear window into the evidence—not a replacement for the original project.</p><p className="dialog-copy">This is a separate Next.js research presentation workspace. Your original Python / Streamlit architecture, eight dashboard pages, SQLite archive, and Windows drive have not been edited or connected.</p><dl className="detail-list"><div><dt>Collection data</dt><dd>Supplied report aggregates</dd></div><div><dt>Notebook storage</dt><dd>Separate PostgreSQL database</dd></div><div><dt>Notebook access</dt><dd>Browser-scoped, HTTP-only cookie</dd></div><div><dt>Source filesystem access</dt><dd>None</dd></div><div><dt>Next phase</dt><dd>Not approved or executed</dd></div></dl><a className="button repository-button" href={SOURCE.repository} target="_blank" rel="noreferrer"><Github size={16}/>Open the original project <ArrowUpRight size={14}/></a></div></Modal>}
    {toast && <div className="toast" role="status"><span><Check size={16}/></span><p>{toast}</p><button aria-label="Dismiss notification" onClick={() => setToast("")}><X size={15}/></button></div>}
  </div>;
}
