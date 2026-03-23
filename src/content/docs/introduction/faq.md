---
title: FAQ
description: Frequently asked questions about wayID.
---

## What is wayID?

wayID is trust infrastructure for AI agents. It binds verified human identities to AI agents so that consumers can check who operates an agent before trusting it — like SSL certificates, but for AI agents.

## Who is wayID for?

- **Agent operators** who want to prove their agents are legitimate
- **Consumers and platforms** who want to verify an agent's identity before interacting with it
- **Developers** who need a trust layer for AI agent applications

## What data does wayID store about me?

wayID stores only your nationality (a 2-letter country code) and a hash of your identity proof. No personal data — no name, date of birth, or identity document content — is transmitted to or stored by wayID.

## What identity verification methods are supported?

Currently: **Concordium** (zero-knowledge proofs via wallet) and **MitID** (Danish eID). World ID and Self are planned. See [Verification Methods](/identity/methods/).

## Can I use multiple verification methods?

Yes. Each identity verification adds 3 points to your trust score. Using both Concordium and MitID gives you 6 points — enough for the highest grade (A).

## What is a trust score?

A letter grade (A–E) calculated from your identity verifications and verified social links. See [Trust Scores](/certificate/trust-scores/) for the full scoring system.

## What is a DID?

A decentralized identifier — a unique string that identifies your agent: `wayid:agent:{24-character-base58}`. It can be resolved to a W3C DID document containing the agent's public key. See [DID Resolution](/specifications/did-resolution/).

## How does agent claiming work?

You generate a short-lived token on the wayID dashboard, give it to your agent, and the agent signs it with its Ed25519 private key. This cryptographic handshake proves the agent controls its key and binds it to your account. See the [Agent Claiming Guide](/agents/claiming/).

## What is OpenClaw?

The open standard wayID uses for agent identity and skill publication. Skills are published on [ClawHub](https://clawhub.ai). See [OpenClaw](/certificate/openclaw/).

## What are skills?

Packaged capabilities defined as `SKILL.md` files that teach agents how to perform tasks. wayID provides skills like `/whoareyou` (show verified identity card) and `wayid-claim` (register with wayID). See [Skills](/agents/skills/).

## Can I revoke an agent?

Yes, from the wayID dashboard. Revocation is permanent — a revoked agent cannot be re-registered with the same DID. You can also temporarily suspend an agent.

## How do consumers verify my agent?

Three ways:
1. **Certificate page** — Visit `https://way.je/agent/{did}` to see the certificate
2. **API lookup** — `GET /api/v1/agent/{publicKey}` returns certificate info
3. **Challenge-response** — `POST /api/v1/agent/verify` proves key ownership

See the [Verification API](/specifications/api-reference/).

## Is wayID free?

Yes. wayID is free for agent operators during the prototype phase.
