---
title: Agent Claiming Guide
description: Step-by-step guide to registering your AI agent with WayID.
---

Claiming is the process of binding your AI agent's cryptographic identity to your verified WayID account. After claiming, your agent receives a WayID DID and a verifiable certificate.

There are three ways to claim:

- **[The WayID OpenClaw plugin](#claiming-with-the-openclaw-plugin)** (recommended for OpenClaw) — one command, all signing done in-process. The agent's private key never enters the model's context.
- **[The WayID Hermes plugin](#claiming-with-the-hermes-plugin)** (recommended for Hermes) — the same in-process flow for the [Hermes Agent](/certificate/hermes/) runtime.
- **[The direct claim API](#claiming-with-the-claim-api)** — for any other runtime or custom integration that signs and submits the claim itself.

## Prerequisites

- A WayID account with at least one [identity verification](/identity/methods/)
- A claim token from [way.je/claim](https://way.je/claim) (see [Step 1](#step-1-generate-a-claim-token) below)

## Claiming with the OpenClaw plugin

The [WayID OpenClaw plugin](/certificate/openclaw/) (`@lineagelabs/wayid`) is the recommended way to claim an agent. It generates an Ed25519 keypair, signs the claim payload, submits it, and persists the result — all in code. **The private key is never returned to the model or placed in the conversation.**

### Step 1: Generate a claim token

On the WayID dashboard at [way.je/claim](https://way.je/claim), click **Generate Token**. You'll receive a short-lived token in this format:

```
wayid-verify-{32-hex-chars}
```

For example: `wayid-verify-a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6`.

The token expires after **10 minutes**. A countdown timer on the dashboard shows the remaining time.

### Step 2: Install the plugin

Install the plugin into your OpenClaw agent from ClawHub:

```bash
openclaw plugins install clawhub:@lineagelabs/wayid
```

This registers two slash commands — `/claim` and `/whoareyou` (with `/way` and `/who` as aliases) — and the corresponding `wayid_claim` and `wayid_whoareyou` tools.

### Step 3: Run the claim command

Paste the token into your agent and run:

```
/claim wayid-verify-a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6
```

The plugin then, entirely in-process:

1. **Generates an Ed25519 keypair** (or reuses an existing one), storing it at `{openclaw}/workspace/wayid-key.json`. This file holds the private key and is never read back into the conversation.
2. **Signs `${claimToken}|${agentId}`** (the token, a literal pipe character, then the `agentId`) with the private key. Folding `agentId` into the signed bytes prevents a captured signature from being rebound to a different sub-agent on resubmit.
3. **Submits the claim** to `POST {issuer}/api/v1/claim`.
4. **Persists the DID record** to `{openclaw}/workspace/wayid.json` (DID, issuer, and claim timestamp — no key material).

On success the agent returns the new DID and a link to finish your profile:

```
✅ wayid:agent:7f3aB9cDe2FgHjKmNpQrSt4U

👉 https://way.je/claim/embellish?wayid=7f3aB9cDe2FgHjKmNpQrSt4U
```

The DID is live immediately.

### `agentId` and named agents

The claim defaults to the `agentId` `main`, stored under `{openclaw}/workspace/wayid.json`. A named OpenClaw agent claims under its own `agentId`, and its DID record lives at `{openclaw}/workspace-<agentId>/wayid.json`. Each `agentId` on the keypair mints a distinct DID, so one OpenClaw install can register multiple sub-agents.

### Pointing at a different WayID server

The plugin defaults to `https://way.je`. To claim against a staging or self-hosted server, set the `wayidIssuer` config for the plugin in `openclaw.json`:

```json
{
  "plugins": {
    "entries": {
      "@lineagelabs/wayid": {
        "config": { "wayidIssuer": "https://staging.way.je" }
      }
    }
  }
}
```

From a Docker container hitting a local dev server, use `http://host.docker.internal:5173`.

### Re-claiming

Re-claiming the same `agentId` is blocked — the plugin reports the existing DID and claim date. To rebind, revoke the agent from the [way.je dashboard](https://way.je) and run `/claim` again. To register an _additional_ sub-agent on the same install, claim with a different `agentId`.

## Claiming with the Hermes plugin

The [WayID Hermes plugin](/certificate/hermes/) (`wayid-hermes`) is the recommended way to claim an agent running on [Hermes Agent](https://hermes-agent.nousresearch.com). It performs the exact same in-process flow as the OpenClaw plugin — generate keypair, sign `${claimToken}|${agentId}`, submit, persist — and never returns the private key to the model.

### Step 1: Generate a claim token

Same as above — generate a token at [way.je/claim](https://way.je/claim).

### Step 2: Install and enable the plugin

The plugin is a Python package on PyPI:

```bash
pip install wayid-hermes
hermes plugins enable wayid
```

Hermes discovers the plugin via its `hermes_agent.plugins` entry-point on the next startup, and `hermes plugins enable wayid` adds it to the allow-list. This registers the same two slash commands — `/claim` and `/whoareyou` (with `/way` and `/who` as aliases) — and the `wayid_claim` and `wayid_whoareyou` tools.

### Step 3: Run the claim command

Paste the token into your agent and run:

```
/claim wayid-verify-a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6
```

The keypair is stored at `~/.hermes/wayid/<agentId>/wayid-key.json` (private key, never read back into the conversation) and the DID record at `~/.hermes/wayid/<agentId>/wayid.json`. The `agentId` defaults to `main`. On success the agent returns the new DID and a link to finish your profile, exactly as the OpenClaw plugin does.

### Pointing at a different WayID server

The plugin defaults to `https://way.je`. To claim against a staging or self-hosted server, set the `WAYID_ISSUER` environment variable before starting Hermes (e.g. `WAYID_ISSUER=http://localhost:5173` for a local dev server).

### Re-claiming

As with OpenClaw, re-claiming the same `agentId` is blocked — the plugin reports the existing DID and claim date. Revoke the agent from the [way.je dashboard](https://way.je) and re-run `/claim`, or claim an additional sub-agent with a different `agentId`.

## Claiming with the claim API

If your agent runs neither plugin (another runtime, or a custom integration), it can sign and submit the claim directly. The cryptographic handshake is identical — the plugins are simply in-process implementations of these same steps.

### Step 1: Generate a claim token

Same as above — generate a token at [way.je/claim](https://way.je/claim).

### Step 2: Give the token to your agent

Paste the claim token into your agent's chat or terminal. The agent needs this token to prove it is acting on your behalf.

### Step 3: Agent signs and submits the claim

Your agent will:

1. **Load or generate an Ed25519 keypair.** The OpenClaw plugin stores its key at `{openclaw}/workspace/wayid-key.json`; a custom integration keeps the private key wherever it manages secrets. The public key is base64-encoded for submission.

2. **Choose an `agentId`** — an operator-supplied sub-agent label (e.g. `acme-bot`, `support-bot`). The same keypair can stamp out distinct DIDs for multiple sub-agents — each `(publicKey, agentId)` pair gets its own WayID DID.

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

## Completing the agent profile (optional)

Profile fields are optional and editable at any time from the WayID dashboard (the plugin links you straight to it after a successful claim):

- **Username** — URL-safe handle (e.g. `acme-bot`)
- **Display name** — Public-facing name
- **Description** — What the agent does (max 160 characters)
- **Avatar** — Optional profile image

Your agent is verifiable from the moment the claim succeeds — at:

```
https://way.je/agent/wayid:agent:{your-agent-did}
```

## Token lifecycle

| Event               | Behaviour                              |
| ------------------- | -------------------------------------- |
| Token generated     | Valid for 10 minutes                   |
| Token redeemed      | Marked as used; cannot be reused       |
| Token expired       | Returns `410 Gone`; generate a new one |
| New token generated | Previous token is invalidated          |

## Troubleshooting

**"Invalid token format" error (plugin)**
The `/claim` command expects `wayid-verify-` followed by 32 hex characters. The plugin will also accept a bare 32-char hex string and add the prefix for you, but pass the full token shown on the dashboard when you can.

**"Invalid signature" error**
The agent must sign the bytes `${claimToken}|${agentId}` (token, pipe, agentId) — not the bare token. No trailing whitespace or newlines. The signature must be base64-encoded.

**"Already claimed" / "Key already claimed" error**
Each `(publicKey, agentId)` pair can only be registered once. With the plugin, revoke the agent from the way.je dashboard and re-run `/claim`, or claim a new sub-agent with a different `agentId`. With the direct API, pick a different `agentId`, or use a fresh keypair to start over with the same `agentId`.

**Token expired before the claim was submitted**
Generate a new token. Tokens are intentionally short-lived (10 minutes) to prevent replay attacks.

## What happens after claiming

- Your agent can use the [`/whoareyou`](/agents/skills/) command (or the `wayid_whoareyou` tool) to display its verified identity card
- Consumers can verify your agent via the [Verification API](/specifications/api-reference/)
- Your agent's certificate contributes to its [trust score](/certificate/trust-scores/)
