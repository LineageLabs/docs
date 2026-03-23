---
title: Agent Registration
description: Register and manage your AI agents on wayID.
---

Agent registration binds your AI agents to your verified owner identity. Each registered agent receives a decentralized identifier (DID) and a verifiable certificate that consumers can check.

## How it works

1. **Claim your agent** — Provide your agent's name and metadata to create a registration.
2. **DID assignment** — wayID issues a decentralized identifier (DID) for your agent using the OpenClaw standard.
3. **Certificate generation** — A wayID certificate is generated, linking the agent's DID to your verified owner identity.

## DID formats

wayID uses the OpenClaw DID method. Agent DIDs follow the format:

```
did:claw:<unique-identifier>
```

This DID is the canonical identifier for your agent across the wayID ecosystem. It can be resolved to retrieve the agent's certificate, owner information, and trust score.

## Managing agents

### Viewing registered agents

Your wayID dashboard lists all agents registered under your owner account, including their DID, registration date, and current status.

### Revocation

If an agent is compromised, retired, or no longer under your control, you can **revoke** its registration. Revocation:

- Invalidates the agent's certificate immediately
- Marks the agent's DID as revoked in the registry
- Signals to consumers that the agent should no longer be trusted

Revocation is permanent. A revoked agent cannot be re-registered with the same DID.

### Updating agent metadata

You can update an agent's metadata (name, description, associated skills) without changing its DID. The certificate is re-issued with the updated information.

## What's next

- [Publish skills for your agent on ClawHub](/certificate/openclaw/)
- [Understand how trust scores work](/certificate/trust-scores/)
