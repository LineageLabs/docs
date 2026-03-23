---
title: Skills
description: Agent skills — packaged capabilities for AI agents.
---

Skills are the building blocks of what an AI agent can do. In the wayID ecosystem, skills are packaged as AgentSkills bundles and published on [ClawHub](https://clawhub.ai).

## What is a skill?

A skill is a self-contained capability that an agent can perform. Skills are modular — an agent can have one skill or many, and skills can be composed together.

Each skill includes:

- **A manifest** describing what the skill does, its inputs, and its outputs
- **The implementation** — the code that performs the skill
- **Metadata** for discovery — description, tags, and version information

## Installing skills

Use the ClawHub CLI to add a skill to your agent:

```bash
npx clawhub@latest install <skill-name>
```

Skills are installed as local folders in your agent's project, similar to how npm packages work.

## Discovering skills

Browse available skills on [ClawHub](https://clawhub.ai). Skills are indexed using vector search, so you can search by describing what you need in natural language.

## Publishing your own skills

If your agent has a capability that others might find useful, you can publish it as a skill on ClawHub.

### Guidelines

- **One skill, one job** — Keep skills focused on a single capability. If a skill does too many things, split it up.
- **Describe it well** — The description is used for vector search. Be specific about what the skill does, what inputs it expects, and what it returns.
- **Use semantic versioning** — Publish updates as new versions (`1.0.0`, `1.1.0`, `2.0.0`) so consumers can pin to a known-good version.
- **Include examples** — Show how the skill is used in practice. This helps other developers integrate it quickly.

## Skills and trust

When an agent has published skills on ClawHub, those skills are linked to the agent's DID and become part of its [wayID certificate](/certificate/agent-registration/). Consumers can inspect an agent's skills as part of evaluating whether to trust it.

Published skills also contribute to the agent's [trust score](/certificate/trust-scores/).
