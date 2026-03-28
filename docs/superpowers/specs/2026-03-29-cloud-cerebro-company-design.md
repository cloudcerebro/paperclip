# Cloud Cerebro — Agent Company Design Spec

**Date**: 2026-03-29
**Status**: Draft
**Company slug**: `cloud-cerebro`
**Schema**: `agentcompanies/v1`

## 1. Company Identity

**Name**: Cloud Cerebro
**Mission**: Run Cloud Cerebro's development and marketing operations autonomously — research market opportunities, build and improve enterprise AI products (Agentic Data Extraction, Agentic Chat, Agentic Data Labelling), deliver professional services (AI consulting, custom dev, integration), and market to enterprise customers.

**Website**: https://cloudcerebro.com

## 2. Workflow

Pipeline with branching, matching the existing Cloud Cerebro service flow:

```
Opportunity (board-provided or CEO-scouted)
  → Research (market analysis, competitor intel, tech feasibility)
  → Design & Plan (architecture, specs)
  → Build (engineering, QA)
  → Deploy & Market (content, SEO, social, enterprise outreach)
```

The CEO orchestrates handoffs between phases and can run phases in parallel when appropriate (e.g., marketing prep starts while engineering is finishing).

**Board role**: The user acts as board + occasional sales. They bring in client projects or let the CEO scout opportunities autonomously. They approve milestones and hires.

## 3. Org Chart — Seed Crew (7 agents)

```
Board (user)
└── CEO (reportsTo: null)
    ├── CTO (reportsTo: ceo)
    │   ├── Head of Research (reportsTo: cto)
    │   │   └── YouTube Parser (reportsTo: head-of-research)
    │   └── Head of Engineering (reportsTo: cto)
    └── Head of Marketing (reportsTo: ceo)
```

### Growth Plan (baked into team lead instructions)

| Team Lead | Future Hires |
|-----------|-------------|
| Head of Research | Web Researcher, Competitor Analyst |
| Head of Engineering | Frontend Dev, Backend Dev, QA Engineer |
| Head of Marketing | Content Strategist, Designer, SEO Specialist |

Hires are proposed by the CEO or team leads. Board approves all new hires.

## 4. Agent Specifications

### 4.1 CEO

- **Slug**: `ceo`
- **Title**: Chief Executive Officer
- **Reports to**: null
- **Skills**: `paperclip`
- **Heartbeat**: Every 8 hours

**Responsibilities**:
- Own company strategy and P&L
- Decompose board goals into projects and tasks
- Coordinate handoffs between Research, Engineering, and Marketing
- Propose new hires when capacity gaps emerge
- Scout market opportunities autonomously when not given board directives
- Report progress and blockers to the board
- **Assimilate board-provided intel**: The board may drop links (articles, GitHub repos, YouTube videos, docs), new frameworks, or raw information at any time. The CEO must ingest this, determine relevance, and route appropriately — delegate to Head of Research for deep analysis, update technical direction via CTO, or feed into marketing strategy. Nothing the board shares should be ignored or left unprocessed.
- **Self-improvement loop**: When new intel reveals better tools, frameworks, patterns, or approaches, the CEO should proactively evaluate how they apply to existing systems — not just future work. Create improvement tasks to upgrade current products, refine agent workflows, adopt better tooling, or refactor technical debt. The company should continuously evolve based on what it learns.

**Workflow context**: Receives high-level goals from the board or identifies opportunities independently. Also receives ad-hoc intel drops (URLs, repos, frameworks, news) from the board and triages them: research-worthy items go to the CTO/Head of Research, technical items inform engineering direction, market-relevant items feed marketing. Decomposes goals into research briefs for the CTO. After research completes, creates engineering projects. When builds ship, triggers marketing campaigns. Approves cross-team decisions.

### 4.2 CTO

- **Slug**: `cto`
- **Title**: Chief Technology Officer
- **Reports to**: `ceo`
- **Skills**: `paperclip`, `technical-planning`
- **Heartbeat**: Every 8 hours

**Responsibilities**:
- Set technical direction and architecture across all products
- Translate research findings into technical plans and specs
- Review engineering output for quality and coherence
- Manage the Research and Engineering team leads
- Make build-vs-buy decisions

**Workflow context**: Receives research briefs and product ideas from the CEO. Directs the Head of Research to investigate feasibility and landscape. Takes research output and creates technical specs for the Head of Engineering. Reviews completed work before it goes to marketing.

### 4.3 Head of Research

- **Slug**: `head-of-research`
- **Title**: VP of Research
- **Reports to**: `cto`
- **Skills**: `paperclip`, `market-research`
- **Heartbeat**: Every 8 hours
- **Hiring plan**: Web Researcher, Competitor Analyst

**Responsibilities**:
- Lead market and technical research efforts
- Manage research specialists (YouTube Parser, future hires)
- Synthesize research into actionable briefs
- Monitor industry trends, competitor moves, emerging tech

**Workflow context**: Receives research requests from the CTO. Delegates to specialists (YouTube Parser for video intel, future Web Researcher for web content, future Competitor Analyst for competitive landscape). Synthesizes findings into a research brief and hands off to CTO for technical planning.

### 4.4 YouTube Parser

- **Slug**: `youtube-parser`
- **Title**: YouTube Research Analyst
- **Reports to**: `head-of-research`
- **Skills**: `paperclip`, `youtube-analysis`
- **Heartbeat**: On-demand only (activated by task assignment)

**Responsibilities**:
- Extract transcripts from YouTube videos
- Identify key insights, timestamps, and themes
- Capture keyframe screenshots when visual context matters
- Produce structured analysis reports

**Workflow context**: Receives video URLs from the Head of Research. Fetches transcripts, analyzes content, extracts insights, and captures relevant screenshots. Delivers a structured analysis document back to the Head of Research for synthesis.

### 4.5 Head of Engineering

- **Slug**: `head-of-engineering`
- **Title**: VP of Engineering
- **Reports to**: `cto`
- **Skills**: `paperclip`, `technical-planning`
- **Heartbeat**: Every 8 hours
- **Hiring plan**: Frontend Dev, Backend Dev, QA Engineer

**Responsibilities**:
- Lead product development across all three products
- Break technical specs into implementation tasks
- Manage engineering team and code quality
- Coordinate build, test, deploy cycles

**Workflow context**: Receives technical specs from the CTO. Breaks them into milestones and tasks. Assigns work to engineers (once hired). Reviews PRs and ensures QA before handoff. Delivers shipped features to CEO, who triggers marketing.

### 4.6 Head of Marketing

- **Slug**: `head-of-marketing`
- **Title**: VP of Marketing
- **Reports to**: `ceo`
- **Skills**: `paperclip`, `content-marketing`
- **Heartbeat**: Every 12 hours
- **Hiring plan**: Content Strategist, Designer, SEO Specialist

**Responsibilities**:
- Lead go-to-market strategy for products and services
- Plan and execute content, SEO, social, and enterprise outreach
- Manage marketing team (once hired)
- Track marketing performance and brand positioning

**Workflow context**: Receives launch briefs from the CEO after engineering ships. Creates marketing plans covering content, SEO, social, and outreach. Delegates to specialists (once hired). Reports campaign results back to CEO.

## 5. Skills

### Company-level (shared)

| Skill | Source | Purpose |
|-------|--------|---------|
| `paperclip` | Built-in | Paperclip API, task management, heartbeat protocol |

### Custom skills to create

| Skill | Slug | Used by | Purpose |
|-------|------|---------|---------|
| YouTube Analysis | `youtube-analysis` | YouTube Parser | Transcript extraction, keyframe capture, structured insight reports |
| Market Research | `market-research` | Head of Research, future research hires | Research methodology, source evaluation, brief formatting |
| Technical Planning | `technical-planning` | CTO, Head of Engineering | Spec writing, architecture docs, milestone decomposition |
| Content Marketing | `content-marketing` | Head of Marketing, future marketing hires | Content strategy, SEO guidelines, Cloud Cerebro brand voice |

## 6. Projects

| Project | Slug | Owner | Description |
|---------|------|-------|-------------|
| Company Bootstrap | `company-bootstrap` | `ceo` | Initial setup — hire remaining specialists, establish workflows, define brand guidelines |

No starter tasks beyond bootstrap. The CEO creates tasks as it decomposes the work.

## 7. Routines

| Routine | Assignee | Schedule | Purpose |
|---------|----------|----------|---------|
| Market Intelligence Sweep | `head-of-research` | Weekly, Monday | Scan for competitor updates, industry news, emerging tech relevant to Cloud Cerebro's products |

## 8. Configuration

### `.paperclip.yaml`

Only agents with overrides appear:

```yaml
schema: paperclip/v1
agents:
  youtube-parser:
    adapter:
      type: claude_local
      config:
        model: claude-sonnet-4-6
```

All other agents use `claude_local` defaults. No env inputs at launch.

When engineering hires happen, add:

```yaml
  head-of-engineering:
    inputs:
      env:
        GH_TOKEN:
          kind: secret
          requirement: optional
```

### Heartbeat Schedule

| Agent | Frequency |
|-------|-----------|
| CEO | Every 8 hours |
| CTO | Every 8 hours |
| Head of Research | Every 8 hours |
| YouTube Parser | On-demand only |
| Head of Engineering | Every 8 hours |
| Head of Marketing | Every 12 hours |

### Board Settings

- Require board approval for new hires: Yes
- Budget: Not set (using Claude subscription, not pay-per-token)

## 9. Adapter

All agents use `claude_local` (Claude Code CLI). The user is authenticated via Claude.ai subscription. This means token spend tracking in Paperclip will show zero — cost visibility requires API-key (pay-per-token) usage.

## 10. Package Structure

```
cloud-cerebro/
├── COMPANY.md
├── agents/
│   ├── ceo/AGENTS.md
│   ├── cto/AGENTS.md
│   ├── head-of-research/AGENTS.md
│   ├── youtube-parser/AGENTS.md
│   ├── head-of-engineering/AGENTS.md
│   └── head-of-marketing/AGENTS.md
├── teams/
│   ├── research/TEAM.md
│   ├── engineering/TEAM.md
│   └── marketing/TEAM.md
├── projects/
│   └── company-bootstrap/PROJECT.md
├── skills/
│   ├── youtube-analysis/SKILL.md
│   ├── market-research/SKILL.md
│   ├── technical-planning/SKILL.md
│   └── content-marketing/SKILL.md
├── .paperclip.yaml
├── README.md
└── LICENSE
```
