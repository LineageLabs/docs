---
title: Agent Card
description: Multi-format agent identity card for verification and display.
---

The agent card endpoint returns a formatted identity card for a registered agent. It is designed for platforms and integrations that need to display verified agent information to users.

## Endpoint

```
GET /api/agents/{wayidDid}/card
```

This endpoint is public — no authentication required. It currently returns JSON. (Rate limiting is planned but not yet enforced.)

## Response format

```json
{
  "wayidDid": "wayid:agent:7f3aB9cDe2FgHjKmNpQrSt4U",
  "displayName": "Acme Bot",
  "username": "acme-bot",
  "description": "AI assistant for Acme Corp",
  "avatarUrl": "https://way.je/avatars/acme-bot.png",
  "status": "active",
  "claimedAt": "2026-03-10T16:45:00Z",
  "owner": {
    "displayName": "Jane Smith",
    "username": "janesmith"
  },
  "verification": {
    "provider": "concordium",
    "label": "Concordium ID",
    "verifiedAt": "2026-02-20T10:30:00Z"
  },
  "channels": [
    { "kind": "domain", "handleOrDomain": "acme.example" }
  ],
  "grade": "A",
  "tier": 2,
  "gradeIsFallback": false,
  "certificateUrl": "https://way.je/agent/acme-bot"
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `wayidDid` | string | The agent's WayID DID |
| `displayName` | string | Public-facing agent name |
| `username` | string \| null | URL-safe handle |
| `description` | string | What the agent does (max 160 chars) |
| `avatarUrl` | string | Agent profile image URL |
| `status` | string | `"active"`, `"suspended"`, or `"revoked"` |
| `claimedAt` | string | ISO 8601 registration timestamp |
| `owner` | object \| null | Owner's display name and username (`null` if the owner profile is incomplete) |
| `verification` | object or null | Most recent identity verification, if any |
| `channels` | array | Verified channels bound to the agent (`kind` + `handleOrDomain`) |
| `grade` | string | Trust grade `A`–`E` (see [Trust Scores](/certificate/trust-scores/)) |
| `tier` | number \| null | Strongest channel tier (`2` = domain/A2A, `1` = chat/OpenClaw) |
| `gradeIsFallback` | boolean | `true` when the grade rests only on the OpenClaw fallback channel |
| `certificateUrl` | string | Full URL to the agent's public certificate page |

### Verification object

Present when the owner has completed identity verification. `null` otherwise.

| Field | Type | Description |
|-------|------|-------------|
| `provider` | string | The identity provider (e.g. `"concordium"`, `"worldid"`) |
| `label` | string | Human-readable provider name where one is mapped (e.g. `"Concordium ID"`); otherwise the raw `provider` value |
| `verifiedAt` | string | ISO 8601 timestamp of verification |

## In-chat usage

The [`/whoareyou`](/agents/skills/) skill (and its `/who` and `/way` aliases) displays an agent's identity card directly in conversation. The skill reads its own DID from disk and fetches a compact card from `GET /api/v1/agent/{id}/card`, which returns just the fields needed for display:

```json
{
  "displayName": "Acme Bot",
  "owner": { "displayName": "Jane Smith", "username": "janesmith" },
  "verificationStatus": "verified",
  "telegramHandle": "@acme-bot",
  "certificateUrl": "https://way.je/agent/acme-bot"
}
```

`verificationStatus` is one of `"verified"`, `"claim"`, or `"unverified"`. The skill renders it as:

```
🛡 Acme Bot

@acme-bot is bound to a WayID-verified owner.

Owner: Jane Smith (WayID: human.janesmith)
✓ Verified Human

View Certificate → https://way.je/agent/acme-bot
```

## Content negotiation

The card endpoints return JSON today. Additional formats — plain text for chat integrations and an HTML snippet for web embeds, selectable via the `Accept` header — are planned.

_Coming soon._

## Caching

Card responses may be cached briefly, so changes to an agent's profile or verification status can take a short time to appear.
