import { mkdirSync, writeFileSync } from "fs";
import path from "path";

export type QualityFinding = {
  route: string;
  type: "accessibility" | "link" | "route" | "performance";
  severity: "critical" | "serious" | "moderate" | "minor" | "warning";
  message: string;
  details?: string;
};

export type QualityScanSummary = {
  scannedAt: string;
  baseUrl: string;
  routes: string[];
  findings: QualityFinding[];
  counts: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
    warning: number;
  };
  lighthouse?: {
    desktop?: Record<string, number | null>;
    mobile?: Record<string, number | null>;
  };
  passed: boolean;
};

const REPORT_DIR = path.join(process.cwd(), "quality-reports");

export function ensureReportDir(): string {
  mkdirSync(REPORT_DIR, { recursive: true });
  return REPORT_DIR;
}

export function writeQualityReports(summary: QualityScanSummary): void {
  const dir = ensureReportDir();

  writeFileSync(path.join(dir, "summary.json"), JSON.stringify(summary, null, 2));

  const lines = [
    "# Frontend Quality Scan Summary",
    "",
    `**Scanned at:** ${summary.scannedAt}`,
    `**Base URL:** ${summary.baseUrl}`,
    `**Overall:** ${summary.passed ? "PASS" : "FAIL"}`,
    "",
    "## Routes scanned",
    ...summary.routes.map((route) => `- ${route}`),
    "",
    "## Finding counts",
    `- Critical: ${summary.counts.critical}`,
    `- Serious: ${summary.counts.serious}`,
    `- Moderate: ${summary.counts.moderate}`,
    `- Minor: ${summary.counts.minor}`,
    `- Warnings: ${summary.counts.warning}`,
    "",
  ];

  if (summary.lighthouse) {
    lines.push("## Lighthouse score baselines", "");
    if (summary.lighthouse.desktop) {
      lines.push("### Desktop");
      for (const [key, value] of Object.entries(summary.lighthouse.desktop)) {
        lines.push(`- ${key}: ${value ?? "n/a"}`);
      }
      lines.push("");
    }
    if (summary.lighthouse.mobile) {
      lines.push("### Mobile");
      for (const [key, value] of Object.entries(summary.lighthouse.mobile)) {
        lines.push(`- ${key}: ${value ?? "n/a"}`);
      }
      lines.push("");
    }
  }

  if (summary.findings.length) {
    lines.push("## Findings", "");
    for (const finding of summary.findings) {
      lines.push(`- **[${finding.severity}] ${finding.type}** \`${finding.route}\`: ${finding.message}`);
      if (finding.details) {
        lines.push(`  - ${finding.details}`);
      }
    }
  } else {
    lines.push("## Findings", "", "No blocking findings recorded.");
  }

  writeFileSync(path.join(dir, "summary.md"), lines.join("\n"));
}

export function countSeverities(findings: QualityFinding[]): QualityScanSummary["counts"] {
  return findings.reduce(
    (acc, finding) => {
      acc[finding.severity] += 1;
      return acc;
    },
    { critical: 0, serious: 0, moderate: 0, minor: 0, warning: 0 }
  );
}
