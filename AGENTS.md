# AGENTS.md

## Cursor Cloud specific instructions

### Project Overview

Japanese-language corporate website for マネーデザイン (Money Design), a generative AI implementation support consultancy. Built with Next.js 15 (App Router), React 19, TypeScript, and Tailwind CSS 3.

### Development Commands

Standard commands are in `package.json` scripts:

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server (port 3000) |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint check |
| `pnpm test` | Jest unit tests |

### Non-obvious Notes

- `pnpm install` will warn about build scripts for `sharp` and `unrs-resolver`. These are already approved in `package.json` under `pnpm.onlyBuiltDependencies` — no manual approval needed.
- The `next lint` command shows a deprecation warning about migrating to the ESLint CLI in Next.js 16. This is informational and does not affect functionality.
- Jest requires `ts-node` to parse the TypeScript config file (`jest.config.ts`).
- The site is entirely in Japanese. All UI text, form labels, and placeholders use Japanese characters.
