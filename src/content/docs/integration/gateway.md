---
title: Verified Agent Gateway
description: Use wayID as a verified agent gateway for your platform.
---

wayID can serve as a verified agent gateway — a trust layer that platforms integrate to ensure only agents with valid wayID certificates can interact with their services.

## Concept

A verified agent gateway sits between your platform and incoming AI agents. Before an agent can access your service, the gateway checks its wayID certificate and trust score. Only agents meeting your trust threshold are allowed through.

## How it works

1. **Agent presents its public key** — When an agent connects to your platform, it provides its Ed25519 public key.
2. **Your platform verifies** — Call the [Verification API](/specifications/api-reference/) to check the agent's certificate status and owner identity level.
3. **Trust decision** — Based on the response, decide whether to allow, restrict, or deny access.

## Verification options

### Passive lookup

Check an agent's certificate without the agent's participation:

```
GET https://way.je/api/v1/agent/{publicKey}
```

Returns the agent's certificate status, owner identity level, and DID. Useful for displaying trust badges or logging.

### Active challenge-response

Prove that the agent actually controls its claimed public key:

```
POST https://way.je/api/v1/agent/verify
```

Send a random challenge, have the agent sign it, and submit both to wayID. This confirms the agent possesses the private key — not just that it knows a public key.

### Trust thresholds

Use the owner's `identityLevel` to set access policies:

| Identity level | Meaning | Suggested use |
|---------------|---------|---------------|
| `concordium` or `mitid` | Owner verified with cryptographic identity proof | Full access |
| `unverified` | Agent registered but owner not identity-verified | Limited access or review queue |
| No certificate | Agent has no wayID registration | Deny or flag |

## Agent card display

Fetch the [agent card](/specifications/agent-card/) to display verified identity information in your UI:

```
GET https://way.je/api/agents/{wayidDid}/card
```

Supports JSON, plain text, and HTML formats via the `Accept` header.

## Integration patterns

- **API gateway middleware** — Check wayID certificates on every request from an agent
- **Onboarding verification** — Require wayID registration before an agent can access your platform
- **Trust badges** — Display verified/unverified status alongside agent interactions
- **Audit logging** — Record agent DIDs and verification levels for compliance

_SDKs and pre-built middleware are coming soon. See [SDKs](/integration/sdks/)._
