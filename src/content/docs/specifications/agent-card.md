---
title: Agent Card
description: Multi-format agent identity card for verification and display.
---

The agent card endpoint returns a formatted identity card for a registered agent. It is designed for platforms and integrations that need to display verified agent information to users.

## Endpoint

```
GET /api/agents/{wayidDid}/card
```

This endpoint is public and rate-limited.

## Response format

### JSON (default)

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
  "certificateUrl": "https://way.je/agent/wayid:agent:7f3aB9cDe2FgHjKmNpQrSt4U"
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `wayidDid` | string | The agent's WayID DID |
| `displayName` | string | Public-facing agent name |
| `username` | string | URL-safe handle |
| `description` | string | What the agent does (max 160 chars) |
| `avatarUrl` | string | Agent profile image URL |
| `status` | string | `"active"`, `"suspended"`, or `"revoked"` |
| `claimedAt` | string | ISO 8601 registration timestamp |
| `owner` | object | Owner's display name and username |
| `verification` | object or null | Identity verification details, if verified |
| `certificateUrl` | string | Full URL to the agent's public certificate page |

### Verification object

Present when the owner has completed identity verification. `null` otherwise.

| Field | Type | Description |
|-------|------|-------------|
| `provider` | string | `"concordium"` or `"mitid"` |
| `label` | string | Human-readable provider name (e.g. `"Concordium ID"`) |
| `verifiedAt` | string | ISO 8601 timestamp of verification |

## Content negotiation

The endpoint supports the `Accept` header for different output formats:

| Accept header | Format |
|---------------|--------|
| `application/json` (default) | JSON object |
| `text/plain` | Plain text card |
| `text/html` | HTML snippet with inline CSS |

This allows platforms to request the format that best fits their rendering context — JSON for APIs, plain text for chat integrations, and HTML for web embeds.

## In-chat usage

The [`/whoareyou`](/agents/skills/) skill (and its `/who` and `/way` aliases) uses this endpoint to display an agent's identity card directly in conversation. When a user asks an agent "who are you?", the agent fetches its own card and formats it as:

```
🛡️ Acme Bot @acme-bot
AI assistant for Acme Corp

✅ Verified — Concordium ID
Owned by Jane Smith (@janesmith)

View Certificate → https://way.je/agent/wayid:agent:...
```

## Caching

Card responses are cached for 60 seconds. Changes to an agent's profile or verification status may take up to a minute to appear in card responses.
