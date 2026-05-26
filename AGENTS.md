# AGENTS.md

## Project context

This is a monorepo project with:

- `apps/web` — Vite + React + TypeScript frontend
- `apps/api/` — Node.js + Fastify API backend

## General rules

- Do not change files unless asked
- Keep changes minimal and focused on the requested task.
- Do not rewrite unrelated code.
- Follow the existing project structure and naming conventions.
- Before adding a new dependency, explain why it is needed.
- Do not introduce abstractions unless they solve a real and current problem.
- Avoid premature optimization and unnecessary architectural complexity.
- Keep the implementation as simple as the current project scale and requirements allow.
- Prefer explicit and straightforward code over highly generic or "clever" solutions.
- Do not over-engineer solutions. This project prefers pragmatic and maintainable code over theoretical scalability.


## Response style

- Answer in Russian.
- Be brief and task-focused.
- Do not add over-explanations unless asked.
- Stay within the current project architecture.
- Give concrete changes, not general theory.

## Project-specific answers

- For architecture and file placement questions, answer specifically for this repository.
- Before answering where to put a file, inspect the existing project structure.
- Do not give generic option lists like "Option 1 / Option 2" unless explicitly asked.
- Prefer one recommended solution with a concrete path.
- If there are alternatives, mention them briefly only after the main recommendation.
- Use existing conventions from this project as the source of truth.
- If the project structure is unclear, inspect files first instead of guessing.

## Forbidden actions

- Do not start the project or long-running dev servers.
- Do not run `pnpm dev`, `pnpm start`, `npm run dev`, `npm start` or similar long-running commands.
- Do not run database migrations unless explicitly asked.

## Allowed checks

Run only targeted verification commands when relevant:

```bash
pnpm lint
pnpm format:check