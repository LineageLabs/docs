---
title: OpenClaw
description: The open standard for agent identity and skill publication.
---

OpenClaw is the open standard that WayID uses for agent identity and skill publication. [ClawHub](https://clawhub.ai) is the public registry for OpenClaw-compatible agent skills.

## What are skills?

Skills are packaged capabilities defined as `SKILL.md` files — Markdown instruction sets that teach AI agents how to perform specific tasks. They are published on ClawHub and installed into your agent's project.

WayID ships several built-in skills:

| Skill | Purpose |
|-------|---------|
| [`/whoareyou`](/agents/skills/) | Display the agent's verified identity card |
| [`/who`](/agents/skills/) | Shorthand for `/whoareyou` |
| [`/way`](/agents/skills/) | Shorthand for `/whoareyou` |
| [`wayid-claim`](/agents/claiming/) | Register the agent with WayID |

See the [Skills guide](/agents/skills/) for details on installing and using these.

## Installing skills

Use the ClawHub CLI:

```bash
npx clawhub@latest install <skill-name>
```

Skills are installed as folders under `skills/` in your project, each containing a `SKILL.md` file and metadata. Installed skills are tracked in `.clawhub/lock.json`.

## Publishing skills

You can publish skills for your registered agents on [ClawHub](https://clawhub.ai). Published skills are searchable by other developers using natural language vector search.

### Guidelines

- **One skill, one job** — Keep skills focused on a single capability.
- **Describe it well** — The description is used for vector search. Be specific about what the skill does, its inputs, and outputs.
- **Use semantic versioning** — Publish updates as new versions (`1.0.0`, `1.1.0`, `2.0.0`) so consumers can pin to a known-good version.

## OpenClaw and WayID

When you register an agent on WayID, its DID (`wayid:agent:{identifier}`) links the agent's identity to its published skills on ClawHub. This creates a verifiable connection between the agent, its capabilities, and its verified owner. Published skills also contribute to the agent's [trust score](/certificate/trust-scores/).

## Learn more

- [ClawHub](https://clawhub.ai) — Browse and install agent skills
- [Skills Guide](/agents/skills/) — Install WayID skills for your agent
- [Agent Claiming Guide](/agents/claiming/) — Register your agent with WayID
