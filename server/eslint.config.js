const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  // ─────────────────────────────────────────────
  // Global ignores
  // ─────────────────────────────────────────────
  {
    ignores: [
      "node_modules/**",
      "coverage/**",
      "dist/**",
      "build/**",
      "uploads/**",
      "tmp/**",
      ".env",
      ".env.*",
    ],
  },

  // ─────────────────────────────────────────────
  // ESLint recommended rules
  // ─────────────────────────────────────────────
  js.configs.recommended,

  // ─────────────────────────────────────────────
  // Node.js / CommonJS
  // ─────────────────────────────────────────────
  {
    files: ["**/*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",

      globals: {
        ...globals.node,
      },
    },

    rules: {
      // ────────────────
      // Possible errors
      // ────────────────
      "no-undef": "error",
      "no-unreachable": "error",
      "no-constant-condition": "error",
      "no-dupe-keys": "error",
      "no-duplicate-case": "error",
      "no-self-assign": "error",
      "no-self-compare": "error",
      "valid-typeof": "error",

      // ────────────────
      // Best practices
      // ────────────────
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-return-await": "error",
      "no-throw-literal": "error",
      "no-useless-catch": "error",
      "no-useless-concat": "error",
      "no-with": "error",

      // ────────────────
      // Variables
      // ────────────────
      "no-var": "error",

      "prefer-const": [
        "error",
        {
          destructuring: "all",
          ignoreReadBeforeAssign: true,
        },
      ],

      "no-unused-vars": [
        "warn",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "none",
        },
      ],

      // ────────────────
      // Security / dangerous patterns
      // ────────────────
      "no-new-wrappers": "error",
      "no-proto": "error",
      "no-script-url": "error",
      "no-sequences": "error",

      // ────────────────
      // Code quality
      // ────────────────
      "no-duplicate-imports": "error",
      "no-unneeded-ternary": "error",
      "no-useless-return": "error",
      "no-lone-blocks": "error",
      "no-empty": [
        "error",
        {
          allowEmptyCatch: true,
        },
      ],

      // ────────────────
      // Node backend
      // ────────────────
      // console.log is perfectly normal for a backend.
      "no-console": "off",
    },
  },
];