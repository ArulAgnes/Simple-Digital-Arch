import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Archaeology — Research Workspace",
  description: "Understanding the evolution of digital work through filesystem metadata. A read-only research workspace with transparent evidence and phase-by-phase safeguards.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
