import { CATEGORIES, SOURCE, percentage, toGiB } from "./research";

// Serialize only an existing presentation chart. This function never reads source files.
export function serializeChart(chart: SVGSVGElement): string {
  const ns = "http://www.w3.org/2000/svg";
  const root = document.createElementNS(ns, "svg");
  root.setAttribute("xmlns", ns);
  const isDonut = Boolean(chart.closest(".donut-wrap"));
  const original = chart.viewBox.baseVal;
  const width = isDonut ? 510 : original.width;
  const height = isDonut ? 290 : original.height + 100;
  root.setAttribute("viewBox", `0 0 ${width} ${height}`);
  root.setAttribute("width", String(width));
  root.setAttribute("height", String(height));
  root.setAttribute("role", "img");
  const title = isDonut ? "Storage composition · GiB and share of total" : chart.getAttribute("aria-label") || "Reported research chart";
  root.setAttribute("aria-label", title);
  const description = document.createElementNS(ns, "desc");
  description.textContent = `${SOURCE.provenance} Snapshot ${SOURCE.id}. ${isDonut ? "All reported categories; smaller categories are grouped in the remaining segment." : "Selected report excerpt only. Missing records are not estimated."}`;
  root.append(description);
  const style = document.createElementNS(ns, "style");
  style.textContent = "text{font-family:Arial,sans-serif}.axis-label{font-size:10px;fill:#728066}.bar-label{font-size:12px;fill:#566548}";
  root.append(style);
  const background = document.createElementNS(ns, "rect");
  background.setAttribute("width", String(width)); background.setAttribute("height", String(height)); background.setAttribute("fill", "#ffffff"); root.append(background);
  function text(value: string, x: number, y: number, size: number, color = "#536448", weight = "400") {
    const node = document.createElementNS(ns, "text");
    node.textContent = value; node.setAttribute("x", String(x)); node.setAttribute("y", String(y)); node.setAttribute("font-size", String(size)); node.setAttribute("fill", color); node.setAttribute("font-weight", weight); root.append(node); return node;
  }
  text(title, 17, 24, 13, "#34432c", "600");
  const drawing = document.createElementNS(ns, "g");
  drawing.setAttribute("transform", isDonut ? "translate(17 43)" : "translate(0 37)");
  const copy = chart.cloneNode(true) as SVGSVGElement;
  copy.querySelectorAll(".chart-column > g").forEach(tooltip => tooltip.remove());
  copy.querySelectorAll("[opacity]").forEach(element => element.setAttribute("opacity", "1"));
  copy.querySelectorAll(".donut-segment").forEach(element => element.setAttribute("stroke-width", "25"));
  for (const node of Array.from(copy.childNodes)) drawing.append(node);
  root.append(drawing);
  if (isDonut) {
    text("Total storage", 109, 122, 10, "#7d8b70").setAttribute("text-anchor", "middle");
    text(`${toGiB(SOURCE.totalBytes).toFixed(2)} GiB`, 109, 145, 19, "#4a603b", "600").setAttribute("text-anchor", "middle");
    const sorted = [...CATEGORIES].sort((a, b) => b.bytes - a.bytes);
    const items = [...sorted.slice(0, 5), { name: "Remaining types", color: "#e7e6de", bytes: sorted.slice(5).reduce((total, item) => total + item.bytes, 0) }];
    items.forEach((item, index) => {
      const y = 68 + index * 25;
      const swatch = document.createElementNS(ns, "rect"); swatch.setAttribute("x", "225"); swatch.setAttribute("y", String(y - 8)); swatch.setAttribute("width", "8"); swatch.setAttribute("height", "8"); swatch.setAttribute("rx", "2"); swatch.setAttribute("fill", item.color); root.append(swatch);
      text(item.name, 243, y, 11);
      text(`${toGiB(item.bytes).toFixed(2)} GiB · ${percentage(item.bytes, SOURCE.totalBytes).toFixed(1)}%`, 490, y, 10).setAttribute("text-anchor", "end");
    });
  }
  text(`Supplied report · Snapshot ${SOURCE.id} · Not locally re-verified`, 17, height - 29, 8.7, "#7e8a73");
  text(isDonut ? "All 12 categories · 1 GiB = 1,073,741,824 bytes" : "Partial report table · missing observations are not estimated", 17, height - 13, 8.7, "#7e8a73");
  return new XMLSerializer().serializeToString(root);
}
