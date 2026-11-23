"use client";

import { useState } from "react";
import { ArrowUpRight, Info } from "lucide-react";
import { CATEGORIES, EXTENSIONS, SOURCE, formatNumber, percentage, toGiB } from "@/lib/research";

export function FileTypeChart({ onExplore }: { onExplore: () => void }) {
  const [mode, setMode] = useState<"count" | "bytes">("count");
  const [hovered, setHovered] = useState<string | null>(null);
  const entries = [...EXTENSIONS].sort((a, b) => b[mode] - a[mode]).slice(0, 6);
  const max = mode === "count" ? 200000 : 30 * 1024 ** 3;
  const colors = ["#b85f3c", "#c97a56", "#d69673", "#dfb297", "#e8c6b0", "#eed8c8"];
  return <section className="panel distribution-card">
    <div className="panel-heading"><div><h2>File type distribution</h2><p>The formats that shape your collection</p></div><div className="segmented" aria-label="Chart metric"><button className={mode === "count" ? "selected" : ""} onClick={() => { setMode("count"); setHovered(null); }}>Files</button><button className={mode === "bytes" ? "selected" : ""} onClick={() => { setMode("bytes"); setHovered(null); }}>Storage</button></div></div>
    <div className="bar-chart-wrap">
      <svg className="file-bar-chart" viewBox="0 0 610 205" role="img" aria-label={`Selected reported extensions by ${mode === "count" ? "file count" : "storage in GiB"}`}>
        {[0, 1, 2, 3, 4].map(i => { const y = 160 - i * 36; return <g key={i}><line x1="47" x2="600" y1={y} y2={y} stroke="#eeeee9" strokeDasharray={i === 0 ? "0" : "3 4"}/><text x="35" y={y + 4} textAnchor="end" className="axis-label">{mode === "count" ? (i === 0 ? "0" : `${i * 50}k`) : (i * 7.5).toString()}</text></g>; })}
        {entries.map((item, i) => { const x = 67 + i * 90; const height = item[mode] / max * 144; const active = hovered === item.name; return <g key={item.name} className="chart-column" tabIndex={0} role="button" aria-label={`${item.name}: ${mode === "count" ? `${formatNumber(item.count)} files` : `${toGiB(item.bytes).toFixed(2)} GiB`}. Open file type analysis.`} onMouseEnter={() => setHovered(item.name)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(item.name)} onBlur={() => setHovered(null)} onClick={onExplore} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onExplore(); } }}>
          <rect x={x - 10} y="6" width="78" height="178" fill="transparent"/>
          <rect x={x} y={160 - height} width="48" height={Math.max(height, 1)} rx="4" fill={colors[i]} opacity={hovered && !active ? 0.55 : 1}/>
          <text x={x + 24} y="183" textAnchor="middle" className="bar-label">{item.name}</text>
          {active && <g><rect x={Math.min(x - 18, 477)} y={Math.max(0, 128 - height)} width="111" height="25" rx="5" fill="#333d34"/><text x={Math.min(x - 18, 477) + 55.5} y={Math.max(0, 128 - height) + 16} textAnchor="middle" fill="white" fontSize="10">{mode === "count" ? `${formatNumber(item.count)} files` : `${toGiB(item.bytes).toFixed(2)} GiB`}</text></g>}
        </g>; })}
      </svg>
      <span className="chart-unit">{mode === "count" ? "Number of files" : "Storage (GiB)"}</span>
    </div>
    <div className="panel-foot"><span><span className="legend-dot terracotta"/>Selected extensions · reported table excerpt</span><button className="text-link" onClick={onExplore}>Explore file types <ArrowUpRight size={13}/></button></div>
  </section>;
}

export function StorageDonut({ onExplore }: { onExplore: () => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const ordered = [...CATEGORIES].sort((a, b) => b.bytes - a.bytes);
  const items = [...ordered.slice(0, 5), { name: "Remaining types", count: ordered.slice(5).reduce((sum, c) => sum + c.count, 0), bytes: ordered.slice(5).reduce((sum, c) => sum + c.bytes, 0), color: "#e7e6de" }];
  const active = items.find(item => item.name === hovered);
  const circumference = 2 * Math.PI * 66;
  let offset = 0;
  return <section className="panel storage-card">
    <div className="panel-heading"><div><h2>Where the space goes</h2><p>Storage distribution by category</p></div><button className="icon-button subdued" onClick={onExplore} aria-label="Explore storage analytics"><ArrowUpRight size={17}/></button></div>
    <div className="donut-content"><div className="donut-wrap"><svg viewBox="0 0 184 184" aria-label="Storage composition by category" role="img">
      <circle cx="92" cy="92" r="66" fill="none" stroke="#f0eee7" strokeWidth="25"/>
      {items.map(item => { const length = item.bytes / SOURCE.totalBytes * circumference; const itemOffset = offset; offset += length; return <circle key={item.name} cx="92" cy="92" r="66" fill="none" stroke={item.color} strokeWidth={hovered === item.name ? 29 : 25} strokeDasharray={`${Math.max(0, length - 2)} ${circumference - Math.max(0, length - 2)}`} strokeDashoffset={-itemOffset} transform="rotate(-90 92 92)" className="donut-segment" opacity={hovered && hovered !== item.name ? 0.45 : 1} onMouseEnter={() => setHovered(item.name)} onMouseLeave={() => setHovered(null)}><title>{`${item.name}: ${toGiB(item.bytes).toFixed(2)} GiB (${percentage(item.bytes, SOURCE.totalBytes).toFixed(2)}%)`}</title></circle>; })}
    </svg><div className="donut-center"><span>{active ? active.name : "Total storage"}</span><strong>{toGiB(active ? active.bytes : SOURCE.totalBytes).toFixed(2)}</strong><small>GiB</small></div></div>
      <div className="donut-legend">{items.map(item => <button key={item.name} onMouseEnter={() => setHovered(item.name)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(item.name)} onBlur={() => setHovered(null)} onClick={() => setHovered(hovered === item.name ? null : item.name)} className={hovered === item.name ? "highlighted" : ""}><span className="legend-dot" style={{ background: item.color }}/><span>{item.name}</span><strong>{percentage(item.bytes, SOURCE.totalBytes).toFixed(1)}%</strong></button>)}</div>
    </div>
    <div className="panel-foot"><span><Info size={13}/> GiB = 1,073,741,824 bytes</span><span>12 categories</span></div>
  </section>;
}

export function DistributionBars({ items, color = "#b9613e", unit = "files", logarithmic = false }: { items: { label: string; value: number }[]; color?: string; unit?: string; logarithmic?: boolean }) {
  const max = Math.max(...items.map(i => logarithmic ? Math.log10(i.value + 1) : i.value), 1);
  return <div className="horizontal-bars">{items.map(item => <div className="horizontal-bar-row" key={item.label} title={`${item.label}: ${formatNumber(item.value)} ${unit}`}><span className="horizontal-bar-name">{item.label}</span><div className="horizontal-bar-track"><div style={{ width: `${(logarithmic ? Math.log10(item.value + 1) : item.value) / max * 100}%`, background: color }}/></div><strong>{formatNumber(item.value)}</strong></div>)}</div>;
}
