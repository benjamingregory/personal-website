import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
    ],
  },
  ...nextCoreWebVitals,
  {
    rules: {
      // Mount-gate / sync-from-external-system patterns (theme toggle,
      // carousel selection) intentionally set state in effects.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default config;
