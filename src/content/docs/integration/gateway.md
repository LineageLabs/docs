---
title: Verified Agent Gateway
description: Use WayID as a verified agent gateway for your platform.
---

WayID can serve as a verified agent gateway — a trust layer that platforms integrate to ensure only agents with valid WayID certificates can interact with their services.

## Concept

A verified agent gateway sits between your platform and incoming AI agents. Before an agent can access your service, the gateway checks its WayID certificate and trust score. Only agents meeting your trust threshold are allowed through.

## How it works

1. **Agent presents its public key** — When an agent connects to your platform, it provides its Ed25519 public key.
2. **Your platform verifies** — Call the [Verification API](/specifications/api-reference/) to check the agent's certificate status and owner identity level.
3. **Trust decision** — Based on the response, decide whether to allow, restrict, or deny access.

## Verification options

### Passive lookup

Check an agent's certificate without the agent's participation:

```
GET https://way.je/api/v1/agent/{did}
```

Returns the agent's certificate status, owner identity level, and DID. Useful for displaying trust badges or logging. (The legacy `{publicKey}` form of this endpoint still works but is deprecated.)

### Active challenge-response

Prove that the agent actually controls its claimed public key:

```
POST https://way.je/api/v1/agent/verify
```

Send a random challenge, have the agent sign it, and submit both to WayID. This confirms the agent possesses the private key — not just that it knows a public key.

### Trust thresholds

Use the owner's `identityLevel` to set access policies:

| Identity level | Meaning | Suggested use |
|---------------|---------|---------------|
| A provider name (e.g. `worldid`, `concordium`) | Owner verified with a cryptographic identity proof | Full access |
| `unverified` | Agent registered but owner not identity-verified | Limited access or review queue |
| No certificate | Agent has no WayID registration | Deny or flag |

> The challenge-response endpoint (`/api/v1/agent/verify`) returns the provider name in `identityLevel`. The lookup endpoint reports `identityLevel` as `"verified"`/`"unverified"` and names the provider in `identityMethod`.

## Agent card display

Fetch the [agent card](/specifications/agent-card/) to display verified identity information in your UI:

```
GET https://way.je/api/agents/{wayidDid}/card
```

Returns a JSON identity card (name, owner, verification, channels, trust grade). See the [agent card](/specifications/agent-card/) spec for the full field list.

## Integration patterns

- **API gateway middleware** — Check WayID certificates on every request from an agent
- **Onboarding verification** — Require WayID registration before an agent can access your platform
- **Trust badges** — Display verified/unverified status alongside agent interactions
- **Audit logging** — Record agent DIDs and verification levels for compliance

_SDKs and pre-built middleware are coming soon. See [SDKs](/integration/sdks/)._
