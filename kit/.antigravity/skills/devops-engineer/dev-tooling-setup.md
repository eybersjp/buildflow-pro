---
name: dev-tooling-setup
description: Configures the complete development tooling stack for a production project — ESLint, Prettier, TypeScript strict config, Husky + lint-staged pre-commit hooks, VSCode workspace settings, and EditorConfig. Produces a zero-warning, auto-formatted, type-safe development environment. Activate once during project scaffold.
version: 1.0.0
triggers:
  - "set up dev tools"
  - "configure ESLint"
  - "configure Prettier"
  - "set up pre-commit hooks"
  - "configure TypeScript"
  - "scaffold dev environment"
lifecycle: build
---

# Development Tooling Setup
# BuildFlow Pro — DevOps Intelligence Layer
# Source: devtoolsd/awesome-devtools pattern

## Overview

A production project is not just correct code — it is code that stays correct as the team grows and time passes. Development tooling is what makes correctness automatic rather than aspirational.

This skill sets up a complete, zero-compromise development environment where:
- ESLint catches code quality issues before they're committed
- Prettier enforces consistent formatting automatically
- TypeScript strict mode catches type errors at development time
- Husky + lint-staged prevent unformatted or broken code from ever reaching git history
- VSCode settings ensure the whole team has the same editor experience

---

## When to Activate

- During Phase 5 (Project Scaffold) — set up once, before any feature code is written
- When "configure ESLint" or "set up dev tools" is requested
- Before the first commit to a new repository

---

## Process

Follow this sequence. Order matters — configure tooling before writing application code.

### Step 1 — TypeScript Strict Config
### Step 2 — ESLint Config
### Step 3 — Prettier Config
### Step 4 — EditorConfig
### Step 5 — VSCode Workspace Settings
### Step 6 — Husky + lint-staged
### Step 7 — NPM Scripts
### Step 8 — Verify

---

## Step 1 — TypeScript Strict Config

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },

    // ── Strictness beyond "strict": true ──
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "exactOptionalPropertyTypes": false,

    // ── Error quality ──
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Rationale for extra strictness options:**
- `noUncheckedIndexedAccess` — `arr[0]` is `T | undefined`, not `T`. Prevents index out-of-bounds runtime errors.
- `noImplicitOverride` — Forces explicit `override` keyword, preventing accidental method shadowing.
- `noUnusedLocals` / `noUnusedParameters` — Dead code is a maintenance burden and a sign of incomplete work.

---

## Step 2 — ESLint Config

```js
// eslint.config.mjs (ESLint Flat Config — ESLint v9+)
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // ── Base ──────────────────────────────────────────────────────
  js.configs.recommended,
  ...compat.extends('next/core-web-vitals'),

  // ── TypeScript ────────────────────────────────────────────────
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      'unused-imports': unusedImportsPlugin,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // ── No any ─────────────────────────────────────────────
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',

      // ── Async/await safety ─────────────────────────────────
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',

      // ── Unused code ────────────────────────────────────────
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],

      // ── Type safety ────────────────────────────────────────
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',

      // ── Code quality ───────────────────────────────────────
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  // ── React ─────────────────────────────────────────────────────
  {
    files: ['**/*.tsx', '**/*.jsx'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',

      // ── Accessibility ──────────────────────────────────────
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/label-has-associated-control': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/no-noninteractive-element-interactions': 'error',
    },
  },

  // ── Import ordering ───────────────────────────────────────────
  {
    plugins: { import: importPlugin },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-cycle': 'error',
    },
  },

  // ── Ignored paths ─────────────────────────────────────────────
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'public/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
];
```

---

## Step 3 — Prettier Config

```json
// .prettierrc.json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindConfig": "./tailwind.config.ts"
}
```

```
# .prettierignore
.next
node_modules
out
public
*.sql
*.md
playwright-report
test-results
```

---

## Step 4 — EditorConfig

```ini
# .editorconfig
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false

[*.sql]
indent_size = 4

[Makefile]
indent_style = tab
```

---

## Step 5 — VSCode Workspace Settings

```json
// .vscode/settings.json
{
  // ── Editor ─────────────────────────────────────────────────────
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },
  "editor.rulers": [100],
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.trimAutoWhitespace": true,

  // ── TypeScript ─────────────────────────────────────────────────
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "[typescript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[typescriptreact]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },

  // ── Files ──────────────────────────────────────────────────────
  "files.eol": "\n",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.exclude": {
    "**/.git": true,
    "**/node_modules": true,
    "**/.next": true
  },

  // ── Search ─────────────────────────────────────────────────────
  "search.exclude": {
    "**/node_modules": true,
    "**/.next": true,
    "**/out": true,
    "**/playwright-report": true
  },

  // ── ESLint ─────────────────────────────────────────────────────
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],

  // ── Tailwind ───────────────────────────────────────────────────
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "'([^']*)'"],
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ],

  // ── Git ────────────────────────────────────────────────────────
  "git.enableSmartCommit": true,
  "git.autofetch": true
}
```

```json
// .vscode/extensions.json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-playwright.playwright",
    "vitest.explorer",
    "github.copilot",
    "usernamehw.errorlens",
    "streetsidesoftware.code-spell-checker",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

---

## Step 6 — Husky + lint-staged

```bash
# Install commands (require user approval before running):
npm install --save-dev husky lint-staged
npx husky init
```

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

```bash
# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Enforce Conventional Commits format
# Pattern: type(scope): description
# Types: feat|fix|docs|style|refactor|perf|test|chore|build|ci|revert|security
npx --no-install commitlint --edit "$1"
```

```js
// commitlint.config.js
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'build', 'ci', 'revert', 'security'],
    ],
    'subject-max-length': [2, 'always', 100],
    'body-max-line-length': [1, 'always', 200],
  },
};
```

```json
// package.json additions:
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  }
}
```

---

## Step 7 — NPM Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint --max-warnings 0",
    "lint:fix": "next lint --fix",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:all": "npm run typecheck && npm run lint && npm run test && npm run test:e2e",
    "prepare": "husky"
  }
}
```

---

## Step 8 — Verify

After setup, run the full quality check:

```bash
# These must all pass before writing any feature code
npm run typecheck     # 0 errors expected on empty project
npm run lint          # 0 warnings expected on empty project
npm run format:check  # All files formatted
npm run test          # No failing tests (no tests yet = pass)
```

Expected terminal output:
```
✓ typecheck  — 0 errors
✓ lint       — 0 warnings, 0 errors
✓ format     — all files match prettier config
✓ test       — 0 tests, 0 failures
```

---

## Verification

Before marking this skill complete:

- [ ] `tsconfig.json` has `"strict": true` and all additional strictness options
- [ ] ESLint config bans `any`, floating promises, and unused imports
- [ ] Prettier config is present and enforces LF line endings
- [ ] `.editorconfig` is present for non-VSCode editors
- [ ] `.vscode/settings.json` enables format-on-save and ESLint fix-on-save
- [ ] `.vscode/extensions.json` is present with recommended extensions
- [ ] Husky pre-commit hook runs lint-staged
- [ ] Conventional Commits are enforced via commitlint
- [ ] All NPM scripts are present and working
- [ ] `npm run test:all` passes on the clean scaffold

**Gate:** No feature code is written until `npm run test:all` passes on the scaffold.

---

## Red Flags

- `any` types passing without ESLint error — config is not wired correctly
- Pre-commit hook is bypassed with `git commit --no-verify` — flag and require justification
- `console.log` statements committed without a lint warning — ESLint rule not active
- Different team members getting different formatting — Prettier not configured as default formatter
- TypeScript errors ignored with `// @ts-ignore` without explanation comment

---

## Anti-Rationalisations

- ❌ "We'll add ESLint later" — Retrofitting lint rules onto existing code takes days. Set it up first.
- ❌ "Prettier causes formatting conflicts in PRs" — Prettier eliminates formatting conflicts. Configure it once, never fight about it again.
- ❌ "Strict TypeScript is too strict" — Every `any` type you allow today is a runtime error waiting to happen.
- ❌ "Pre-commit hooks slow down commits" — lint-staged only checks staged files. It adds 2 seconds. This is not negotiable.
- ❌ "We use the default tsconfig" — The default tsconfig allows `any`, allows unused variables, and has no import checking. It is not production-grade.
