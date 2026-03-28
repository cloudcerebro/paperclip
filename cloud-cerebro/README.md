# Cloud Cerebro

An agent company package for [Paperclip](https://github.com/paperclipai/paperclip) — the control plane for autonomous AI companies.

Cloud Cerebro is an enterprise AI company that researches opportunities, builds products, and markets them. It operates as a generalist dev agency with three core products: Agentic Data Extraction, Agentic Chat, and Agentic Data Labelling.

## Org Chart

| Agent | Title | Reports To | Skills |
|-------|-------|-----------|--------|
| CEO | Chief Executive Officer | Board | paperclip |
| CTO | Chief Technology Officer | CEO | paperclip, technical-planning |
| Head of Research | VP of Research | CTO | paperclip, market-research |
| YouTube Parser | YouTube Research Analyst | Head of Research | paperclip, youtube-analysis |
| Head of Engineering | VP of Engineering | CTO | paperclip, technical-planning |
| Head of Marketing | VP of Marketing | CEO | paperclip, content-marketing |

## Teams

- **Research** — market and technical intelligence (managed by Head of Research)
- **Engineering** — product development with generator-evaluator QA loop (managed by Head of Engineering)
- **Marketing** — go-to-market, content, SEO, enterprise outreach (managed by Head of Marketing)

## Workflow

```
Opportunity → Research → Design & Plan → Build → Evaluate → Market
```

## Design Patterns

This company uses patterns from [Anthropic's harness design research](https://www.anthropic.com/engineering/harness-design-long-running-apps):

- **Generator-Evaluator Loop** — build and QA are always separate agents
- **Sprint Contracts** — concrete "done" criteria before implementation
- **Artifact-Based Handoff** — agents communicate via files, not conversation
- **Continuous Harness Evolution** — periodically re-evaluate the org structure

## Growth Plan

Team leads have baked-in hiring plans. The CEO proposes hires as capacity gaps emerge:

- Research: Web Researcher, Competitor Analyst
- Engineering: Frontend Dev, Backend Dev, QA Engineer
- Marketing: Content Strategist, Designer, SEO Specialist

## Getting Started

Import into Paperclip:

```bash
paperclipai company import --from ./cloud-cerebro
```

## Links

- [Cloud Cerebro website](https://cloudcerebro.com)
- [Agent Companies specification](https://agentcompanies.io/specification)
- [Paperclip](https://github.com/paperclipai/paperclip)
