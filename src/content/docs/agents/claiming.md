---
title: Agent Claiming Guide
description: Step-by-step guide to registering your AI agent with wayID.
---

Claiming is the process of binding your AI agent's cryptographic identity to your verified wayID account. After claiming, your agent receives a wayID DID and a verifiable certificate.

## Prerequisites

- A wayID account with at least one [identity verification](/identity/methods/)
- An AI agent running [OpenClaw](https://openclaw.ai) with a generated Ed25519 keypair at `~/.openclaw/identity/device.json`

## The claiming flow

### Step 1: Generate a claim token

On the wayID dashboard at [way.je/claim](https://way.je/claim), click **Generate Token**. You'll receive a short-lived token in this format:

```
wayid-verify-a7b3c9
```

The token expires after **10 minutes**. A countdown timer on the dashboard shows the remaining time.

### Step 2: Give the token to your agent

Paste the claim token into your agent's chat or terminal. The agent needs this token to prove it is acting on your behalf.

### Step 3: Agent signs and submits

Your agent (using the `wayid-claim` skill or equivalent logic) will:

1. **Read its keypair** from `~/.openclaw/identity/device.json`:
   ```json
   { "publicKey": "<base64>", "privateKey": "<base64>" }
   ```

2. **Sign the exact token string** using its Ed25519 private key.

3. **Submit the claim** to the wayID API:
   ```
   POST https://way.je/api/v1/claim
   Content-Type: application/json

   {
     "claimToken": "wayid-verify-a7b3c9",
     "publicKey": "<base64 public key>",
     "signature": "<base64 signature>"
   }
   ```

4. On success, your agent will confirm: _"Done! Your wayID claim has been verified."_

### Step 4: Complete the agent profile

Once the token is redeemed, the wayID dashboard enables the next step. Fill in your agent's:

- **Username** — URL-safe handle (e.g. `acme-bot`)
- **Display name** — Public-facing name
- **Description** — What the agent does (max 160 characters)
- **Avatar** — Optional profile image

### Step 5: Certificate issued

wayID generates a DID for your agent and issues a certificate. Your agent is now verifiable at:

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
The agent must sign the _exact_ token string (e.g. `wayid-verify-a7b3c9`) — no trailing whitespace or newlines. The signature must be base64-encoded.

**"Key already claimed" error**
Each Ed25519 public key can only be registered to one agent. If you need to re-register, use a fresh keypair.

**Token expired before agent could sign**
Generate a new token. Tokens are intentionally short-lived (10 minutes) to prevent replay attacks.

## What happens after claiming

- Your agent can use the [`/whoareyou`](/agents/skills/) skill to display its verified identity card
- Consumers can verify your agent via the [Verification API](/specifications/api-reference/)
- Your agent's certificate contributes to its [trust score](/certificate/trust-scores/)
