---
title: Verified Agent Gateway
description: Use WayID as a verified agent gateway for your platform.
---

WayID can serve as a verified agent gateway — a trust layer that platforms integrate to ensure only agents with valid WayID certificates can interact with their services.

## Concept

A verified agent gateway sits between your platform and incoming AI agents. Before an agent can access your service, the gateway checks its WayID certificate and trust score. Only agents meeting your trust threshold are allowed through.

## How it works

1. **Agent declares its WayID** — An agent identifies itself on the requests it makes with a header:

   ```
   WayID: wayid:agent:{24-char-base58}      # full DID or the bare 24-char tail
   ```

2. **Your gateway resolves it** — Call the [Verification API](/specifications/api-reference/) (or
   drop in the [wayid-verify SDK](/integration/sdks/)) to check the agent's certificate status and
   owner identity level.
3. **Trust decision** — Based on the response, decide whether to allow, restrict, or deny access.

> **Identification, not authentication.** The v1 `WayID` header is _self-asserted_ — it proves the
> named DID exists and is owner-verified, not that the caller holds the agent's private key. That's
> the right tool for attribution ("what kind of agent is this"). To prove the agent actually
> controls its key, use the [active challenge-response](#active-challenge-response) path below, or
> the planned [v2 cryptographic layer](#v2-cryptographic-proof).

### Use the SDK

You don't have to build this yourself — the [**wayid-verify** SDK](/integration/sdks/) wraps the
lookup, an in-memory TTL cache, and a policy helper, with adapters for Express, Cloudflare Workers,
FastAPI / Flask, and [NGINX](/integration/nginx/). By default it **fails open** — a verifier outage
or unknown DID never blocks traffic; the request is served and tagged for logging.

## Verification options

### Passive lookup

Check an agent's certificate without the agent's participation:

```
GET https://way.je/api/v1/agent/{did}
```

Returns the agent's certificate status, owner identity level, and DID. Useful for displaying trust badges or logging. (The legacy `{publicKey}` form of this endpoint still works but is deprecated.)

### Active challenge-response

Prove that the agent actually controls its claimed public key:

```
POST https://way.je/api/v1/agent/verify
```

Send a random challenge, have the agent sign it, and submit both to WayID. This confirms the agent possesses the private key — not just that it knows a public key.

### Trust thresholds

Use the owner's `identityLevel` to set access policies:

| Identity level                                 | Meaning                                            | Suggested use                  |
| ---------------------------------------------- | -------------------------------------------------- | ------------------------------ |
| A provider name (e.g. `worldid`, `concordium`) | Owner verified with a cryptographic identity proof | Full access                    |
| `unverified`                                   | Agent registered but owner not identity-verified   | Limited access or review queue |
| No certificate                                 | Agent has no WayID registration                    | Deny or flag                   |

> The challenge-response endpoint (`/api/v1/agent/verify`) returns the provider name in `identityLevel`. The lookup endpoint reports `identityLevel` as `"verified"`/`"unverified"` and names the provider in `identityMethod`.

## v2: cryptographic proof

The v1 header is identification only. A future **v2** adds cryptographic proof-of-possession by
adopting the IETF HTTP Message Signatures stack (**Web Bot Auth / RFC 9421** — `Signature`,
`Signature-Input`, `Signature-Agent`) rather than a bespoke scheme, so any Web-Bot-Auth-aware
gateway (Cloudflare et al.) can verify WayID agents with replay protection and request binding.

In that model WayID acts as the **key directory + identity oracle**: it serves a Web-Bot-Auth key
directory (JWKS keyed by JWK thumbprint → DID); your gateway verifies the request signature locally,
then calls `GET /api/v1/agent/{did}` for the owner identity and trust grade that raw bot-auth lacks
— per-agent provenance on top of operator-level bot auth. This track is gated on agent-side request
signing; until then, the [active challenge-response](#active-challenge-response) endpoint is the way
to confirm key possession.

## Agent card display

Fetch the [agent card](/specifications/agent-card/) to display verified identity information in your UI:

```
GET https://way.je/api/agents/{wayidDid}/card
```

Returns a JSON identity card (name, owner, verification, channels, trust grade). See the [agent card](/specifications/agent-card/) spec for the full field list.

## Integration patterns

- **API gateway middleware** — Check WayID certificates on every request from an agent
- **Onboarding verification** — Require WayID registration before an agent can access your platform
- **Trust badges** — Display verified/unverified status alongside agent interactions
- **Audit logging** — Record agent DIDs and verification levels for compliance

Pre-built middleware is available — see [SDKs](/integration/sdks/) (Express, Cloudflare Workers,
FastAPI / Flask) and [NGINX edge verification](/integration/nginx/).
