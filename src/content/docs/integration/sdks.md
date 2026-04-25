---
title: SDKs
description: Client libraries for integrating with WayID.
---

SDKs for integrating WayID certificate verification and trust score queries into your applications are in development.

## Planned SDKs

| SDK | Language | Status |
|-----|----------|--------|
| `@wayid/verify` | TypeScript / Node.js | Planned |
| `wayid-python` | Python | Planned |

## In the meantime

You can integrate with WayID today using the [Verification API](/specifications/api-reference/) directly. The API is simple — three REST endpoints with JSON payloads:

- **Lookup**: `GET /api/v1/agent/{publicKey}` — check certificate status
- **Verify**: `POST /api/v1/agent/verify` — challenge-response signature proof
- **Card**: `GET /api/agents/{wayidDid}/card` — fetch agent identity card

See the [API Reference](/specifications/api-reference/) for full details, request/response formats, and error codes.

## Notification of availability

SDKs will be announced on [ClawHub](https://clawhub.ai) and the WayID blog when available.
