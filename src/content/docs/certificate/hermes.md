---
title: Hermes
description: Claim and display your WayID identity from the Hermes Agent runtime.
---

[Hermes Agent](https://hermes-agent.nousresearch.com) (by Nous Research) is a self-hosted Python agent runtime. The WayID Hermes plugin brings the same in-process claim and display flow to Hermes that the [OpenClaw plugin](/certificate/openclaw/) provides for OpenClaw.

## The WayID plugin

The WayID Hermes plugin (`wayid-hermes`) is the recommended way to claim and display an agent's identity on Hermes. It's distributed as a Python package on PyPI:

```bash
pip install wayid-hermes
hermes plugins enable wayid
```

Hermes discovers the plugin through its `hermes_agent.plugins` entry-point on the next startup; `hermes plugins enable wayid` adds it to the allow-list in `~/.hermes/config.yaml`.

The plugin registers:

| Command / tool                                     | Purpose                                                   |
| -------------------------------------------------- | --------------------------------------------------------- |
| `/claim <token>` · `wayid_claim`                   | Claim the agent's WayID identity with a token from way.je |
| `/whoareyou` · `/way` · `/who` · `wayid_whoareyou` | Display the agent's verified identity card                |

Like the OpenClaw plugin, it runs in code: it generates the Ed25519 keypair, signs the claim payload, and renders the certificate **in-process**. The private key is stored separately (at `~/.hermes/wayid/<agentId>/wayid-key.json`) and never enters the model's context, and the rendered card is model-strength-independent — weaker models can't hallucinate or mis-format certificate fields.

Point the plugin at a staging or self-hosted WayID server with the `WAYID_ISSUER` environment variable (defaults to `https://way.je`; use `http://localhost:5173` for a local dev server).

See the [Agent Claiming Guide](/agents/claiming/) for the full claim walkthrough.

## Hermes and OpenClaw

The Hermes plugin is a port of the [OpenClaw plugin](/certificate/openclaw/) — the tools, slash commands, and the on-the-wire claim format (`${claimToken}|${agentId}` signed with Ed25519) are identical, so a Hermes-claimed agent and an OpenClaw-claimed agent are indistinguishable to the WayID server and to anyone verifying the certificate. The differences are runtime-specific:

|                   | OpenClaw                                                                              | Hermes                            |
| ----------------- | ------------------------------------------------------------------------------------- | --------------------------------- |
| Runtime           | Node                                                                                  | Python                            |
| Distribution      | [ClawHub](https://clawhub.ai) (`openclaw plugins install clawhub:@lineagelabs/wayid`) | PyPI (`pip install wayid-hermes`) |
| Enable            | installed = enabled                                                                   | `hermes plugins enable wayid`     |
| Key + DID storage | `{openclaw}/workspace[-<agentId>]/`                                                   | `~/.hermes/wayid/<agentId>/`      |
| Issuer override   | `wayidIssuer` in `openclaw.json`                                                      | `WAYID_ISSUER` env var            |

## Learn more

- [OpenClaw](/certificate/openclaw/) — the sibling plugin and the shared standard
- [Agent Claiming Guide](/agents/claiming/) — register your agent with WayID
- [Hermes Agent](https://hermes-agent.nousresearch.com) — the Hermes runtime
