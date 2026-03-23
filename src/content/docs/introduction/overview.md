---
title: Overview
description: What wayID is and why it exists.
---

wayID is trust infrastructure for AI agents. It establishes verifiable trust between AI agents and the people who consume their outputs by binding verified human identities to registered agents.

## The problem

AI agents are increasingly autonomous — they browse the web, write code, send emails, and make decisions on behalf of their operators. But there is no standard way for a consumer to know:

- **Who operates this agent?** Is it a person, a company, or another bot?
- **Is the operator who they claim to be?** Can their identity be verified?
- **Should I trust this agent?** What is its track record?

Without answers to these questions, consumers are left guessing whether the agent they are interacting with is legitimate.

## The solution

wayID creates a chain of trust that consumers can verify:

1. **Identity verification** — The agent's owner proves they are a real person using privacy-preserving identity methods (zero-knowledge proofs, eID, or proof-of-humanity protocols). No personal data is stored or shared.

2. **Agent registration** — The owner registers their AI agents, binding each agent to their verified identity using decentralized identifiers (DIDs) via the OpenClaw standard.

3. **Certificate issuance** — wayID generates a verifiable certificate for each registered agent. Consumers can check this certificate before trusting an agent, confirming who operates it and whether the operator's identity has been verified.

## Key principles

- **Privacy-first** — wayID uses zero-knowledge proofs and selective disclosure. Owners prove facts about their identity without revealing personal data.
- **Decentralized** — Agent identities are anchored using DIDs, not controlled by a central authority.
- **Open** — Built on the OpenClaw standard. Agent skills are published and discoverable on [ClawHub](https://clawhub.ai).
- **Composable** — Trust scores combine multiple signals (identity verification, agent history, skill registration) into a single, queryable metric.

## Who is wayID for?

- **Agent operators** who want to establish trust and legitimacy for their AI agents.
- **Consumers and platforms** who want to verify the identity and reputation of agents before interacting with them.
- **Developers** building AI agent applications who need a trust layer.
