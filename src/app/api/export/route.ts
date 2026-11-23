import { NextRequest } from "next/server";
import { CATEGORIES, CREATION_YEARS, EXTENSIONS, FOLDER_DEPTHS, NAMING_INDICATORS, SOURCE, reportMarkdown } from "@/lib/research";

export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  const format = request.nextUrl.searchParams.get("format") || "md";
  const section = request.nextUrl.searchParams.get("section") || "categories";
  let body: string;
  let type: string;
  if (format === "md") {
    body = reportMarkdown(); type = "text/markdown; charset=utf-8";
  } else if (format === "json") {
    body = JSON.stringify({ source: SOURCE, evidenceStatus: "reported-not-locally-reverified", categories: CATEGORIES, extensionsExcerpt: EXTENSIONS, creationYearsExcerpt: CREATION_YEARS, folderDepthsExcerpt: FOLDER_DEPTHS, namingIndicatorsExcerpt: NAMING_INDICATORS, partialTables: ["extensionsExcerpt", "creationYearsExcerpt", "folderDepthsExcerpt", "namingIndicatorsExcerpt"], originalFilesAccessed: false }, null, 2);
    type = "application/json; charset=utf-8";
  } else if (format === "csv") {
    const tables: Record<string, { header: string; rows: (string | number)[][] }> = {
      categories: { header: "category,file_count,size_bytes,provenance", rows: CATEGORIES.map(c => [c.name, c.count, c.bytes, "user-supplied report; not locally reverified"]) },
      extensions: { header: "extension,file_count,size_bytes,provenance", rows: EXTENSIONS.map(c => [c.name, c.count, c.bytes, "partial report table; not all extensions"]) },
      timeline: { header: "creation_year,file_count,provenance", rows: CREATION_YEARS.map(c => [c.year, c.count, "partial report table; omitted years are unknown"]) },
      folders: { header: "folder_depth,folder_count,provenance", rows: FOLDER_DEPTHS.map(c => [c.depth, c.count, "partial report table; depths 20-23 omitted"]) },
      naming: { header: "rule,indicator,file_count,provenance", rows: NAMING_INDICATORS.map(c => [c.rule, c.name, c.count, "reported indicators; overlapping categories"]) },
    };
    const table = tables[section];
    if (!table) return Response.json({ error: "Unknown export section." }, { status: 400 });
    body = table.header + "\n" + table.rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n") + "\n";
    type = "text/csv; charset=utf-8";
  } else return Response.json({ error: "Supported formats: md, json, csv." }, { status: 400 });
  return new Response(body, { headers: { "Content-Type": type, "Content-Disposition": `attachment; filename="digital-archaeology-${format === "csv" ? section : "baseline"}-${Date.now()}.${format}"`, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}
