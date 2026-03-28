# CLAUDE.md

## What is Paperclip

Control plane for autonomous AI companies. Agents run externally via adapters and phone home to Paperclip for task assignment, cost tracking, budget enforcement, approvals, and org-chart governance. One deployment runs multiple isolated companies.

## Repo Map

```
server/          Express REST API + orchestration (port 3100)
ui/              React 19 + Vite + TailwindCSS 4 board dashboard
cli/             CLI tools (setup, diagnostics, client operations)
packages/db/     Drizzle ORM schema (59 tables), migrations, PostgreSQL client
packages/shared/ Shared types, validators, constants, API paths
packages/adapters/  7 agent adapter implementations:
                    claude-local, codex-local, cursor-local, gemini-local,
                    opencode-local, pi-local, openclaw-gateway
packages/adapter-utils/  Shared adapter utilities
packages/plugins/        Plugin system (SDK + examples)
doc/             Product docs, specs, plans
```

## Quick Start

```sh
pnpm install
pnpm build
pnpm dev:once     # API + UI at http://localhost:3100
```

Leave `DATABASE_URL` unset for embedded PostgreSQL (auto-creates at `~/.paperclip/instances/default/db/`).

Reset dev DB: `rm -rf ~/.paperclip/instances/default/db && pnpm dev:once`

## Cloud Cerebro (Our Company)

**Dashboard**: http://localhost:3100/CLO/dashboard

Start the server, then open the dashboard to manage Cloud Cerebro. See `cloud-cerebro/guide.md` for detailed usage instructions.

**Import** (already done — only needed if re-creating):
```sh
pnpm paperclipai company import ./cloud-cerebro --yes
```

## Verification (run before claiming done)

```sh
pnpm -r typecheck
pnpm test:run
pnpm build
```

## Database Changes

1. Edit `packages/db/src/schema/*.ts`
2. Export new tables from `packages/db/src/schema/index.ts`
3. `pnpm db:generate` (compiles first, then generates migration)
4. `pnpm -r typecheck`

## Core Engineering Rules

1. **Company-scoped** - every domain entity scoped to a company, enforce boundaries in routes/services
2. **Contracts synchronized** - schema change = update db + shared types + server routes + UI clients
3. **Control-plane invariants** - single-assignee tasks, atomic issue checkout, approval gates, budget hard-stop, activity logging for mutations
4. **Consistent API patterns** - `/api` base, company access checks, actor permissions (board vs agent), activity log entries, standard HTTP errors (400/401/403/404/409/422/500)
5. **No wholesale doc replacement** - prefer additive updates, keep SPEC.md and SPEC-implementation.md aligned
6. **Plan docs** go in `doc/plans/YYYY-MM-DD-slug.md`

## Lockfile Policy

Do not commit `pnpm-lock.yaml` in PRs. CI owns it. CI regenerates on master pushes.

## Agent Companies Spec

Companies are portable org packages (`agentcompanies/v1`):

```
company-slug/
  COMPANY.md              # Root, org boundaries, schema declaration
  agents/<slug>/AGENTS.md # One agent per file, instructions in body
  teams/<slug>/TEAM.md    # Org subtrees
  projects/<slug>/PROJECT.md
  tasks/<slug>/TASK.md
  skills/<slug>/SKILL.md  # Custom skills (shortname resolution)
  .paperclip.yaml         # Adapter config, env inputs (vendor extension)
```

Key rules:
- Every agent except CEO has `reportsTo` set
- Skills resolve by shortname: `skills/<shortname>/SKILL.md`
- External skills use `sources` with `usage: referenced` and commit SHA
- `.paperclip.yaml` only lists agents with actual overrides (adapter/env)
- Do not export secrets, machine-local paths, or database IDs
- Workflow-aware instructions: where work comes from, what you produce, who you hand off to, what triggers you

Valid adapter types: `claude_local`, `codex_local`, `opencode_local`, `pi_local`, `cursor`, `gemini_local`, `openclaw_gateway`

## Skills

Skills in `.agents/skills/` are for Paperclip maintainers. Key ones:
- `company-creator` - create agent company packages (interview, spec-check, generate)
- `create-agent-adapter` - scaffold new adapter implementations

Skills in `.claude/skills/` are Claude Code integration skills.
Skills in `skills/` are shared skill libraries (paperclip, create-agent, create-plugin, para-memory).

## Read Order for New Contributors

1. `doc/GOAL.md` - vision
2. `doc/PRODUCT.md` - product definition
3. `doc/SPEC-implementation.md` - V1 build contract
4. `doc/DEVELOPING.md` - dev workflow
5. `doc/DATABASE.md` - database setup
