---
title: Skills
description: ClawHub skills for WayID — give your AI agent a verifiable identity.
---

Skills are packaged capabilities that teach your AI agent how to do specific things. In the WayID ecosystem, skills are published on [ClawHub](https://clawhub.ai) and installed into your agent's project as `SKILL.md` files — Markdown instruction sets that guide agent behaviour.

## WayID skills

ClawHub ships the following WayID skills out of the box:

| Skill | Command | Description |
|-------|---------|-------------|
| **whoareyou** | `/whoareyou` | Display your agent's verified WayID identity card |
| **who** | `/who` | Shorthand alias for `/whoareyou` |
| **way** | `/way` | Shorthand alias for `/whoareyou` |

Registration (claiming) is **not** a published ClawHub skill — it's a separate flow served as markdown instructions at `https://way.je/claim/SKILL.md`. See the [Agent Claiming Guide](/agents/claiming/).

### `/whoareyou` (and `/who`, `/way`)

When a user invokes this skill, your agent:

1. Reads its WayID DID from its claim file on disk (e.g. `{openclaw}/workspace/wayid.json`, which holds `wayidDid` and the issuing `wayidIssuer` origin). The skill is read-only and never touches the agent's keys.
2. Fetches its identity card with a single call: `GET {wayidIssuer}/api/v1/agent/{id}/card`, where `{id}` is the bare 24-character identifier (the part after `wayid:agent:`).
3. Displays a formatted identity card:

```
🛡 Acme Bot

@acme-bot is bound to a WayID-verified owner.

Owner: Jane Smith (WayID: human.janesmith)
✓ Verified Human

View Certificate → https://way.je/agent/acme-bot
```

If the agent is not yet verified, the badge line shows `✕ Unverified` instead. If no claim file exists, the skill tells the user to run the claim flow first.

`/who` and `/way` are convenience aliases — they behave identically to `/whoareyou`.

### Claiming (registration)

Registering your agent with WayID is handled by a separate flow, not a published skill:

1. The agent owner generates a claim token at `https://way.je/claim`
2. The agent signs `${claimToken}|${agentId}` with its Ed25519 private key
3. The signed claim is submitted to `POST https://way.je/api/v1/claim`
4. On success, the agent receives a WayID DID (`wayid:agent:{24-char-base58}`)

After claiming, anyone can verify the agent at `https://way.je/agent/{did}`. See the [Agent Claiming Guide](/agents/claiming/) for the full walkthrough.

## Installing skills

Install a skill from ClawHub:

```bash
npx clawhub@latest install <skill-name>
```

For example, to install the WayID identity card skill:

```bash
npx clawhub@latest install whoareyou
```

Skills are installed as folders in your agent's project under `skills/`, each containing a `SKILL.md` file and metadata. Installed skills are tracked in a lockfile so versions can be pinned.

### SKILL.md format

Each skill is defined by a `SKILL.md` file with YAML frontmatter:

```markdown
---
name: whoareyou
version: 3.2.0
description: Show your verified WayID identity card when a user asks who you are
user-invocable: true
---

# /whoareyou — Verified Identity Card

When a user types `/whoareyou`, display your verified WayID identity card...
```

Key fields:

- **name** — unique identifier, used as the slash command
- **version** — semantic version
- **description** — short summary (used for discovery search)
- **user-invocable** — `true` if users can trigger it directly, `false` for internal skills

## Discovering skills

Browse available skills on [ClawHub](https://clawhub.ai). Skills are indexed using vector search, so you can search by describing what you need in natural language.

## Skills and trust

When an agent has published skills on ClawHub, those skills are linked to the agent's DID and become part of its [WayID certificate](/certificate/agent-registration/). Consumers can inspect an agent's skills as part of evaluating whether to trust it.

Published skills also contribute to the agent's [trust score](/certificate/trust-scores/).
