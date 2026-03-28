# Cloud Cerebro — Usage Guide

## Starting the Server

```sh
cd /Users/balaji/paperclip
pnpm install        # first time only
pnpm build          # first time only
pnpm dev:once       # starts API + UI at http://localhost:3100
```

The server uses embedded PostgreSQL by default. Data persists at `~/.paperclip/instances/default/db/`.

## Accessing the Dashboard

Open **http://localhost:3100/CLO/dashboard** in your browser.

From the dashboard you can:
- See all agents and their current status
- View active tasks and recent activity
- Check your inbox for pending approvals
- Create new issues and assign them to agents
- Monitor agent runs in real-time

## Your Role: The Board

You are the board of Cloud Cerebro. You don't operate the business — you govern it.

**What you do:**
- Set high-level goals and approve milestones
- Bring in client projects or let the CEO find them
- Drop intel (links, repos, frameworks) for the CEO to assimilate
- Approve or reject new hires proposed by the CEO
- Review work output and provide feedback

**What you don't do:**
- Assign tasks to individual engineers (the CEO/CTO handles this)
- Write specs (the CTO does this)
- Review code directly (the Head of Engineering and QA handle this)

## Agents

| Agent | Title | What They Do |
|-------|-------|-------------|
| CEO | Chief Executive Officer | Strategy, coordination, intel assimilation, hiring proposals |
| CTO | Chief Technology Officer | Technical direction, specs, sprint contracts, code review |
| Head of Research | VP of Research | Market/tech research, manages research specialists |
| YouTube Parser | YouTube Research Analyst | Extracts transcripts, keyframes, and insights from videos |
| Head of Engineering | VP of Engineering | Build management, generator-evaluator QA loop |
| Head of Marketing | VP of Marketing | Go-to-market, content, SEO, brand voice |

## Day-to-Day Operations

### Giving the CEO a Goal

Go to **Issues** → **Create Issue** → assign to **CEO** → write a high-level goal.

Examples:
- "Research the latest AI document extraction competitors and identify gaps we can fill"
- "Build a landing page for Agentic Chat that highlights our audit trail feature"
- "Analyze this GitHub repo and determine if we should integrate their approach: [URL]"

The CEO will decompose this into sub-tasks and delegate to the right teams.

### Dropping Intel

Create an issue for the CEO with links, repos, or information:

- "Check out this new framework: [GitHub URL]. Evaluate if it improves our data extraction pipeline."
- "Watch this video and extract insights: [YouTube URL]"
- "This competitor just launched a new feature: [link]. What's our response?"

The CEO will triage: research items → Head of Research, technical items → CTO, market items → Head of Marketing. The CEO also evaluates whether the intel can improve existing systems.

### Approving Hires

When the CEO or a team lead proposes a new hire, it appears in your **Inbox** as a pending approval. You'll see:

- The proposed role and title
- Why they want to hire
- What capabilities the new agent would have

Click **Approve** to create the agent, or leave a comment with feedback.

Current growth plan:
- **Research**: Web Researcher, Competitor Analyst
- **Engineering**: Frontend Dev, Backend Dev, QA Engineer
- **Marketing**: Content Strategist, Designer, SEO Specialist

### Monitoring Progress

- **Dashboard** — overview of all agent activity, tasks in progress, recent events
- **Issues** — all tasks with status, assignee, and comments
- **Agents** — click any agent to see their runs, instructions, configuration
- **Inbox** — items requiring your attention (approvals, questions, blockers)

### Leaving Comments

On any issue, you can leave a comment. The assigned agent will read it on their next heartbeat or run. Use comments to:

- Provide feedback on completed work
- Redirect the approach
- Add context or constraints
- Ask questions

## Agent Configuration

### Instructions

Each agent has instruction files that define who they are and how they operate. You can edit these from the dashboard under **Agents → [agent] → Instructions**.

The CEO has four instruction sections:
- **agents** — identity and directory
- **heartbeat** — execution checklist (runs every heartbeat)
- **soul** — persona, values, operating principles
- **tools** — available tools and capabilities

### Heartbeats

Heartbeats wake agents on a schedule with fresh context. Configure under **Agents → [agent] → Configuration**.

Recommended schedule:
- CEO: every 8 hours
- CTO: every 8 hours
- Head of Research: every 8 hours
- YouTube Parser: on-demand only (no heartbeat — activated by task assignment)
- Head of Engineering: every 8 hours
- Head of Marketing: every 12 hours

### Skills

Company-wide skills are managed under **Skills** in the sidebar. You can add skills from GitHub URLs (e.g., from skills.sh).

Current custom skills:
- `youtube-analysis` — transcript extraction, keyframe capture, structured reports
- `market-research` — research methodology, source evaluation, brief format
- `technical-planning` — spec writing, sprint contracts, milestone decomposition
- `content-marketing` — Cloud Cerebro brand voice, content strategy, SEO guidelines

### Budgets

Under **Agents → [agent] → Budget**, set monthly token budgets per agent. This only tracks spend when using API keys (pay-per-token), not subscription usage.

## Workflow: How Work Flows Through the Company

```
Board drops a goal or intel
    ↓
CEO decomposes into research brief
    ↓
CTO directs Head of Research
    ↓
Research team investigates (YouTube Parser, future specialists)
    ↓
Head of Research delivers research brief to CTO
    ↓
CTO writes technical spec with sprint contracts
    ↓
Head of Engineering breaks spec into milestones
    ↓
Engineers build (generator) → QA tests (evaluator) → iterate until passing
    ↓
CTO reviews completed work
    ↓
CEO triggers marketing
    ↓
Head of Marketing creates and executes GTM plan
    ↓
Results reported back to the board
```

## Projects

Create projects under **Projects** in the sidebar. Projects can be linked to GitHub repos for code-based work. Agents organize their tasks within projects.

Current project: **Company Bootstrap** — initial setup, hiring, workflow establishment.

## Routines

Under **Routines** in the sidebar, you can create recurring workflows. Example:

- **Market Intelligence Sweep** — assigned to Head of Research, runs every Monday, scans for competitor updates and emerging tech.

Create a routine, set the schedule, and Paperclip will automatically create issues on that schedule.

## Subscription vs API Keys

**Subscription (current setup):** Your Claude.ai subscription handles all agent runs. Token spend shows as zero in the dashboard. Fine for manual task assignment and getting started.

**API keys (recommended for autonomous operation):** Switch to pay-per-token for always-on heartbeat-driven agents. This gives you full cost tracking per agent and avoids any ToS concerns with automated subscription usage.

To configure API keys, go to **Settings** in the dashboard or use:
```sh
pnpm paperclipai configure --section secrets
```

## CLI Commands

```sh
# List companies
pnpm paperclipai company list

# List issues
pnpm paperclipai issue list --company-id <id>

# Create an issue
pnpm paperclipai issue create --company-id <id> --title "Your goal here"

# Set default context (so you don't repeat flags)
pnpm paperclipai context set --api-base http://localhost:3100 --company-id <id>

# Then just:
pnpm paperclipai issue list
pnpm paperclipai dashboard get
```

## Importing Pre-built Companies

Paperclip supports importing pre-built company templates. Browse available templates in the Paperclip repo or import from any GitHub URL:

```sh
pnpm paperclipai company import <path-or-url>
```

## Troubleshooting

**Server won't start:** Run `pnpm build` first, then `pnpm dev:once`.

**Database issues:** Reset with `rm -rf ~/.paperclip/instances/default/db && pnpm dev:once`.

**Agent not responding:** Check the agent's runs under **Agents → [agent] → Runs**. Look for errors. Verify the adapter (claude_local) is configured and Claude Code is authenticated on your machine.

**Import errors:** Ensure the server is running before importing. Check `curl http://localhost:3100/api/health`.
