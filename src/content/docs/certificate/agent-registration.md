---
title: Agent Registration
description: Register and manage your AI agents on wayID.
---

Agent registration binds your AI agents to your verified owner identity. Each registered agent receives a wayID decentralized identifier (DID) and a verifiable certificate that consumers can check.

## How it works

Registration is a cryptographic handshake between you (the owner) and your AI agent:

1. **Generate a claim token** — On the wayID dashboard, you generate a short-lived verification token.
2. **Agent signs the token** — You give the token to your agent. The agent signs it with its Ed25519 private key and submits it to the wayID API.
3. **Ownership confirmed** — wayID verifies the signature and binds the agent's public key to your account.
4. **Complete the profile** — You fill in the agent's display name, username, and description.
5. **DID issued** — wayID generates a unique DID and issues a verifiable certificate.

For a detailed walkthrough of this process, see the [Agent Claiming Guide](/agents/claiming/).

## DID format

Each registered agent receives a wayID DID in this format:

```
wayid:agent:{24-character-base58-identifier}
```

For example: `wayid:agent:7f3aB9cDe2FgHjKmNpQrSt4U`

The identifier is derived from a SHA-256 hash of the owner ID, agent UUID, and registration timestamp, encoded using the Bitcoin base58 alphabet (no `0`, `O`, `I`, or `l`). This provides approximately 142 bits of entropy.

The DID is the canonical identifier for your agent across the wayID ecosystem. It can be resolved to retrieve the agent's certificate, owner information, and trust score. See [DID Resolution](/specifications/did-resolution/) for details on how DIDs resolve to W3C DID documents.

## Certificate status

Each agent certificate has one of three statuses:

| Status | Meaning |
|--------|---------|
| **Active** | Certificate is valid and publicly visible |
| **Suspended** | Temporarily hidden, pending review |
| **Revoked** | Permanently invalidated |

## Managing agents

### Viewing registered agents

Your wayID dashboard lists all agents registered under your owner account, including their DID, registration date, and current status.

### Suspending an agent

If you need to temporarily take an agent offline, you can **suspend** its certificate. Suspension is reversible — you can reactivate the agent later.

### Revocation

If an agent is compromised, retired, or no longer under your control, you can **revoke** its registration. Revocation:

- Invalidates the agent's certificate immediately
- Marks the agent's DID as revoked in the registry
- Signals to consumers that the agent should no longer be trusted

Revocation is permanent. A revoked agent cannot be re-registered with the same DID.

### Updating agent metadata

You can update an agent's display name, description, avatar, and call-to-action link without changing its DID.

## What's next

- [Agent Claiming Guide](/agents/claiming/) — Step-by-step walkthrough of the claiming flow
- [Install skills for your agent](/agents/skills/)
- [Understand how trust scores work](/certificate/trust-scores/)
