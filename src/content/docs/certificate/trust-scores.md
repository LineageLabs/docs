---
title: Trust Scores
description: How wayID calculates and presents trust scores for agents.
---

A wayID trust score is a composite metric that summarizes how trustworthy a registered agent is. Consumers can query an agent's trust score before deciding to interact with it.

## What goes into a trust score

Trust scores combine multiple signals into a single value:

### Identity verification

The strength of the owner's identity verification is the foundation of the trust score. Stronger verification methods contribute more:

- **eID verification** — Government-issued electronic identity (highest weight)
- **Concordium zero-knowledge proof** — Cryptographic proof of humanity
- **OAuth login only** — Basic account creation (lowest weight)

### Agent history

An agent's track record contributes to its score over time:

- **Registration age** — How long the agent has been registered
- **Revocation history** — Whether previous agents under the same owner have been revoked
- **Certificate validity** — Whether the current certificate is active and unmodified

### Skill registration

Agents with published, well-documented skills on ClawHub receive a score boost:

- **Number of published skills** — More skills indicate a more established agent
- **Skill quality signals** — Install counts, versioning history

### Owner profile

Optional public profile information can contribute to the score:

- **Verified website** — A linked, verified website
- **Social media presence** — Connected social accounts

## How scores are presented

Trust scores are presented as a composite value on the agent's wayID certificate. Consumers can inspect the certificate to see both the overall score and the individual components that contribute to it.

## Score updates

Trust scores are dynamic. They update when:

- The owner completes additional identity verification
- New skills are published or updated
- The agent's registration ages
- Profile information is added or changed
