import { spawn } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const ROOT = process.cwd();
const PORT = process.env.QUALITY_SCAN_PORT || "3098";
const BASE_URL = process.env.QUALITY_SCAN_BASE_URL || `http://127.0.0.1:${PORT}`;
const REPORT_DIR = path.join(ROOT, "quality-reports");
const LIGHTHOUSE_CI_DIR = path.join(ROOT, ".lighthouseci");

const PUBLIC_ROUTES = [
  { id: "home", path: "/" },
  { id: "products", path: "/products" },
  { id: "services", path: "/services" },
  { id: "foods", path: "/foods" },
  { id: "vendors", path: "/vendors" },
  { id: "search", path: "/search" },
  { id: "about", path: "/about" },
  { id: "contact", path: "/contact" },
  { id: "faq", path: "/faq" },
  { id: "privacy", path: "/privacy" },
  { id: "terms", path: "/terms" },
  { id: "refund-return", path: "/refund-return" },
  { id: "dispute", path: "/dispute" },
  { id: "consumer-terms", path: "/consumer/terms" },
  { id: "vendor-terms", path: "/vendor/terms" },
  { id: "consumer-trustbadge", path: "/consumer/trustbadge" },
  { id: "vendor-trustbadge", path: "/vendor/trustbadge" },
  { id: "how-to-use", path: "/how-to-use-this-app" },
];

function run(command, args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT,
      stdio: "inherit",
      shell: true,
      env: { ...process.env, ...env },
    });

    child.on("error", reject);
    child.on("close", (code) => resolve(code ?? 1));
  });
}

async function waitForServer(url, timeoutMs = 120_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url, { redirect: "manual" });
      if (response.status < 500) {
        return;
      }
    } catch {
      // retry
    }
    await delay(1000);
  }
  throw new Error(`Server did not become ready at ${url}`);
}

function readJson(filePath) {
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function countSeverities(findings) {
  return findings.reduce(
    (acc, finding) => {
      acc[finding.severity] += 1;
      return acc;
    },
    { critical: 0, serious: 0, moderate: 0, minor: 0, warning: 0 }
  );
}

function collectAxeFindings() {
  const findings = [];
  const axeDir = path.join(REPORT_DIR, "axe");
  if (!existsSync(axeDir)) return findings;

  for (const file of readdirSync(axeDir).filter((name) => name.endsWith(".json"))) {
    const routeId = file.replace(/\.json$/, "");
    const route = PUBLIC_ROUTES.find((entry) => entry.id === routeId);
    const report = readJson(path.join(axeDir, file));
    if (!report?.violations) continue;

    for (const violation of report.violations) {
      if (violation.impact !== "critical" && violation.impact !== "serious") continue;
      findings.push({
        route: route?.path ?? routeId,
        type: "accessibility",
        severity: violation.impact === "critical" ? "critical" : "serious",
        message: violation.help ?? violation.id,
        details: violation.id,
      });
    }
  }

  return findings;
}

function collectBrokenLinkFindings() {
  const broken = readJson(path.join(REPORT_DIR, "links", "broken-links.json"));
  if (!broken?.length) return [];

  return broken.map((entry) => ({
    route: entry.sourceRoute,
    type: "link",
    severity: "critical",
    message: `Broken internal link ${entry.href}`,
    details: `status=${entry.status}`,
  }));
}

function readLighthouseCategoryScores(outputDir) {
  const manifest = readJson(path.join(outputDir, "manifest.json"));
  if (!manifest?.length) return undefined;

  const totals = {};
  let reportCount = 0;

  for (const entry of manifest) {
    const reportPath = entry.jsonPath?.includes(":")
      ? entry.jsonPath
      : path.join(outputDir, entry.jsonPath ?? "");
    const report = readJson(reportPath);
    if (!report?.categories) continue;

    reportCount += 1;
    for (const [key, value] of Object.entries(report.categories)) {
      totals[key] = (totals[key] ?? 0) + (value.score ?? 0);
    }
  }

  if (!reportCount) return undefined;

  return Object.fromEntries(
    Object.entries(totals).map(([key, total]) => [key, Math.round((total / reportCount) * 100) / 100])
  );
}

function cleanupLighthouseCiArtifacts() {
  if (!existsSync(LIGHTHOUSE_CI_DIR)) {
    return;
  }

  rmSync(LIGHTHOUSE_CI_DIR, { recursive: true, force: true });
}

function writeQualityReports(summary) {
  mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(path.join(REPORT_DIR, "summary.json"), JSON.stringify(summary, null, 2));

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

  if (summary.lighthouse?.desktop) {
    lines.push("## Lighthouse desktop baselines", "");
    for (const [key, value] of Object.entries(summary.lighthouse.desktop)) {
      lines.push(`- ${key}: ${value ?? "n/a"}`);
    }
    lines.push("");
  }

  if (summary.lighthouse?.mobile) {
    lines.push("## Lighthouse mobile baselines", "");
    for (const [key, value] of Object.entries(summary.lighthouse.mobile)) {
      lines.push(`- ${key}: ${value}`);
    }
    lines.push("");
  }

  if (summary.findings.length) {
    lines.push("## Findings", "");
    for (const finding of summary.findings) {
      lines.push(`- **[${finding.severity}] ${finding.type}** \`${finding.route}\`: ${finding.message}`);
      if (finding.details) lines.push(`  - ${finding.details}`);
    }
  } else {
    lines.push("## Findings", "", "No blocking findings recorded.");
  }

  writeFileSync(path.join(REPORT_DIR, "summary.md"), lines.join("\n"));
}

async function main() {
  mkdirSync(REPORT_DIR, { recursive: true });

  if (!existsSync(path.join(ROOT, ".next"))) {
    console.log("No .next build output found. Running npm run build...");
    const buildCode = await run("npm", ["run", "build"]);
    if (buildCode !== 0) process.exit(buildCode);
  }

  const serverEnv = {
    PORT,
    QUALITY_SCAN_REUSE_SERVER: "1",
    QUALITY_SCAN_BASE_URL: BASE_URL,
    QUALITY_SCAN_PORT: PORT,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:3099",
    NEXT_PUBLIC_APP_URL: BASE_URL,
  };

  console.log(`Starting Next.js on ${BASE_URL}`);
  const server = spawn("npm", ["run", "start", "--", "-p", PORT], {
    cwd: ROOT,
    stdio: "inherit",
    shell: true,
    env: { ...process.env, ...serverEnv },
  });

  let playwrightCode = 1;
  let lighthouseDesktopCode = 1;
  let lighthouseMobileCode = 1;
  let findings = [];

  try {
    await waitForServer(BASE_URL);

    console.log("Running Playwright quality scans (axe, route smoke, links)...");
    playwrightCode = await run(
      "npx",
      ["playwright", "test", "--config=playwright.quality.config.ts"],
      serverEnv
    );

    console.log("Running Lighthouse desktop scan...");
    lighthouseDesktopCode = await run("npx", ["lhci", "autorun", "--config=lighthouserc.cjs"], serverEnv);

    console.log("Running Lighthouse mobile scan...");
    lighthouseMobileCode = await run(
      "npx",
      ["lhci", "autorun", "--config=lighthouserc.mobile.cjs"],
      serverEnv
    );
  } finally {
    if (!server.killed) {
      server.kill("SIGTERM");
    }

    cleanupLighthouseCiArtifacts();

    findings = [...collectAxeFindings(), ...collectBrokenLinkFindings()];
    const summary = {
      scannedAt: new Date().toISOString(),
      baseUrl: BASE_URL,
      routes: PUBLIC_ROUTES.map((route) => route.path),
      findings,
      counts: countSeverities(findings),
      lighthouse: {
        desktop: readLighthouseCategoryScores(path.join(REPORT_DIR, "lighthouse", "desktop")),
        mobile: readLighthouseCategoryScores(path.join(REPORT_DIR, "lighthouse", "mobile")),
      },
      playwrightExitCode: playwrightCode,
      lighthouseDesktopExitCode: lighthouseDesktopCode,
      lighthouseMobileExitCode: lighthouseMobileCode,
      passed: playwrightCode === 0 && findings.length === 0,
    };

    writeQualityReports(summary);
    console.log("\nQuality scan summary written to quality-reports/summary.json and summary.md");
  }

  if (playwrightCode !== 0) {
    console.error(`Playwright quality scan failed with exit code ${playwrightCode}`);
    process.exit(playwrightCode);
  }

  if (findings.length > 0) {
    console.error(`Blocking quality findings: ${findings.length}`);
    process.exit(1);
  }

  if (lighthouseDesktopCode !== 0 || lighthouseMobileCode !== 0) {
    console.warn(
      "Lighthouse scans reported warnings or collection issues. Performance thresholds are warnings-only in this harness."
    );
  }

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
