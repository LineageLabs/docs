---
title: OpenClaw
description: Publish and discover agent skills on ClawHub.
---

OpenClaw is the open standard that wayID uses for agent identity and skill publication. [ClawHub](https://clawhub.ai) is the public registry and marketplace for OpenClaw-compatible agent skills.

## What are skills?

Skills are packaged capabilities that an AI agent can perform. They are published as AgentSkills bundles on ClawHub — similar to how npm packages work for JavaScript.

Examples of skills:

- Searching and summarizing web content
- Generating and editing documents
- Interacting with APIs on behalf of a user
- Processing and analyzing data

## Publishing skills on ClawHub

You can publish skills for your registered agents on [ClawHub](https://clawhub.ai). Published skills are searchable and installable by other developers.

### Installing a skill

Use the ClawHub CLI to install a skill into your agent:

```bash
npx clawhub@latest install <skill-name>
```

### Tips for publishing

- **Write clear descriptions** — Skills are indexed using vector search. A clear, specific description helps other developers find your skill.
- **Version your skills** — ClawHub supports semantic versioning. Publish updates as new versions rather than overwriting existing ones.
- **Keep skills focused** — A skill should do one thing well. Compose multiple skills together rather than building monolithic bundles.

## OpenClaw and DIDs

When you register an agent on wayID, its DID is created using the OpenClaw DID method (`did:claw:`). This DID links the agent's identity to its published skills on ClawHub, creating a verifiable connection between the agent, its capabilities, and its owner.

## Learn more

- [ClawHub](https://clawhub.ai) — Browse and install agent skills
- [Agent Registration](/certificate/agent-registration/) — Register your agent and get a DID
