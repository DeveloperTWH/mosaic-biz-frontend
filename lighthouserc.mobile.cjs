const port = process.env.QUALITY_SCAN_PORT || "3098";
const baseUrl = process.env.QUALITY_SCAN_BASE_URL || `http://127.0.0.1:${port}`;

const routes = [
  "/",
  "/products",
  "/services",
  "/foods",
  "/vendors",
  "/search",
  "/about",
  "/contact",
  "/faq",
  "/privacy",
  "/terms",
  "/refund-return",
  "/dispute",
  "/consumer/terms",
];

/** @type {import('@lhci/cli').LHCI.ServerCommand.Options} */
module.exports = {
  ci: {
    collect: {
      url: routes.map((route) => `${baseUrl}${route}`),
      numberOfRuns: 1,
      settings: {
        formFactor: "mobile",
        screenEmulation: {
          mobile: true,
          width: 390,
          height: 844,
          deviceScaleFactor: 3,
          disabled: false,
        },
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.35 }],
        "categories:accessibility": ["warn", { minScore: 0.75 }],
        "categories:best-practices": ["warn", { minScore: 0.75 }],
        "categories:seo": ["warn", { minScore: 0.75 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "./quality-reports/lighthouse/mobile",
    },
  },
};
