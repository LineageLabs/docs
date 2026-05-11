---
title: Agent Claiming Guide
description: Step-by-step guide to registering your AI agent with WayID.
---

Claiming is the process of binding your AI agent's cryptographic identity to your verified WayID account. After claiming, your agent receives a WayID DID and a verifiable certificate.

## Prerequisites

- A WayID account with at least one [identity verification](/identity/methods/)
- An AI agent running [OpenClaw](https://openclaw.ai) with a generated Ed25519 keypair at `~/.openclaw/identity/device.json`

## The claiming flow

Claiming is a single-step cryptographic handshake: the agent submits a signed claim and the WayID API immediately mints the DID and issues the certificate. Profile fields (display name, avatar, description) are optional and can be filled in afterwards.

### Step 1: Generate a claim token

On the WayID dashboard at [way.je/claim](https://way.je/claim), click **Generate Token**. You'll receive a short-lived token in this format:

```
wayid-verify-{32-hex-chars}
```

For example: `wayid-verify-a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6`.

The token expires after **10 minutes**. A countdown timer on the dashboard shows the remaining time.

### Step 2: Give the token to your agent

Paste the claim token into your agent's chat or terminal. The agent needs this token to prove it is acting on your behalf.

### Step 3: Agent signs and submits the claim

Your agent (using the `wayid-claim` skill or equivalent logic) will:

1. **Read its keypair** from `~/.openclaw/identity/device.json`:
   ```json
   { "publicKey": "<base64>", "privateKey": "<base64>" }
   ```

2. **Choose an `agentId`** — an operator-supplied sub-agent label inside its OpenClaw runtime (e.g. `acme-bot`, `support-bot`). The same `device.json` keypair can stamp out distinct DIDs for multiple sub-agents — each `(publicKey, agentId)` pair gets its own WayID DID.

3. **Sign `${claimToken}|${agentId}`** (the token, a literal pipe character, then the agentId) using its Ed25519 private key. Folding `agentId` into the signed bytes prevents a captured signature from being rebound to a different sub-agent on resubmit.

4. **Submit the claim** to the WayID API:
   ```
   POST https://way.je/api/v1/claim
   Content-Type: application/json

   {
     "claimToken": "wayid-verify-a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
     "agentId": "acme-bot",
     "publicKey": "<base64 public key>",
     "signature": "<base64 signature of `${claimToken}|${agentId}`>"
   }
   ```

5. **Receive the DID** in the response:
   ```json
   {
     "success": true,
     "message": "Claim verified",
     "wayidDid": "wayid:agent:7f3aB9cDe2FgHjKmNpQrSt4U"
   }
   ```

   The DID is live immediately. The agent should persist `wayidDid` to disk (e.g. `{openclaw}/workspace/wayid.json`) so it can reference its identity in future interactions.

### Step 4 (optional): Complete the agent profile

Profile fields are optional and editable at any time from the WayID dashboard:

- **Username** — URL-safe handle (e.g. `acme-bot`)
- **Display name** — Public-facing name
- **Description** — What the agent does (max 160 characters)
- **Avatar** — Optional profile image

Your agent is verifiable from the moment Step 3 succeeds — at:

```
https://way.je/agent/wayid:agent:{your-agent-did}
```

## Installing the claiming skill

If your agent uses ClawHub skills, install the `wayid-claim` skill so it knows how to handle the claiming flow automatically:

```bash
npx clawhub@latest install wayid-claim
```

The skill teaches your agent the exact steps above — reading the keypair, signing the token, and submitting the claim.

## Token lifecycle

| Event | Behaviour |
|-------|-----------|
| Token generated | Valid for 10 minutes |
| Token redeemed | Marked as used; cannot be reused |
| Token expired | Returns `410 Gone`; generate a new one |
| New token generated | Previous token is invalidated |

## Troubleshooting

**"Invalid signature" error**
The agent must sign the bytes `${claimToken}|${agentId}` (token, pipe, agentId) — not the bare token. No trailing whitespace or newlines. The signature must be base64-encoded.

**"Key already claimed" error**
Each `(publicKey, agentId)` pair can only be registered once. Re-claiming with the same `agentId` on the same key is blocked. To register an additional sub-agent on the same `device.json`, pick a different `agentId`. To start over with the same `agentId`, use a fresh keypair.

**Token expired before agent could sign**
Generate a new token. Tokens are intentionally short-lived (10 minutes) to prevent replay attacks.

## What happens after claiming

- Your agent can use the [`/whoareyou`](/agents/skills/) skill to display its verified identity card
- Consumers can verify your agent via the [Verification API](/specifications/api-reference/)
- Your agent's certificate contributes to its [trust score](/certificate/trust-scores/)
