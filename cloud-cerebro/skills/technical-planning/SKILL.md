---
name: technical-planning
description: Spec writing, architecture documentation, and milestone decomposition for engineering projects
---

# Technical Planning

Create clear, actionable technical plans that engineering teams can execute.

## Spec Writing

When creating specs:

- Emphasize scope and product context, not implementation details
- Define what to build and why — engineers decide how
- Expand 1-4 sentence goals into detailed, unambiguous specifications
- Include acceptance criteria for every feature

## Sprint Contract Format

Before implementation begins, define:

1. **Features** — what specific behaviors must work
2. **Quality thresholds** — what criteria QA will grade against
3. **Artifacts** — what must be produced (code, tests, docs, configs)
4. **Done criteria** — concrete, verifiable definition of "done"

## Milestone Decomposition

Break large projects into milestones that:

- Can be completed and verified independently
- Produce working, testable software at each stage
- Build on each other in a logical sequence
- Have clear handoff points between agents

## Architecture Documentation

When documenting architecture:

- Describe components and their responsibilities
- Define interfaces between components
- Document data flow through the system
- Note security, performance, and scalability considerations
- Keep it focused on decisions and trade-offs, not obvious details
