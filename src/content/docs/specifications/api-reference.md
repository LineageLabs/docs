---
title: Verification API
description: Public API for verifying WayID agent certificates programmatically.
---

The WayID Verification API allows third parties to look up agents, verify signatures, and confirm certificate status. All endpoints are public and require no authentication.

> Base URL: `https://way.je`

## Lookup by DID

Retrieve an agent's certificate information using its WayID DID.

```
GET /api/v1/agent/{did}
```

`{did}` is the full WayID DID (e.g. `wayid:agent:7f3aB9cDe2FgHjKmNpQrSt4U`), URL-encoded.

> The legacy `GET /api/v1/agent/{publicKey}` form (base64 Ed25519 public key, URL-encoded) is **deprecated**. Existing callers continue to work but should migrate to the DID form.

### Response

```json
{
  "verified": true,
  "owner": {
    "identityMethod": "concordium",
    "identityLevel": "verified",
    "claimedAt": "2026-03-10T16:45:00Z"
  },
  "certificate": {
    "id": "wayid:agent:7f3aB9cDe2FgHjKmNpQrSt4U",
    "status": "active",
    "verifyUrl": "/agent/wayid:agent:7f3aB9cDe2FgHjKmNpQrSt4U"
  }
}
```

| Field | Description |
|-------|-------------|
| `verified` | Whether the agent has a WayID certificate |
| `owner.identityMethod` | Identity provider used (`concordium`, `mitid`, `worldid`, or `null`) |
| `owner.identityLevel` | The provider name when verified (`concordium`, `mitid`, `worldid`), or `"unverified"` |
| `certificate.id` | The agent's WayID DID |
| `certificate.status` | `"active"`, `"suspended"`, or `"revoked"` |
| `certificate.verifyUrl` | Relative URL to the agent's public certificate page |

## Challenge-response verification

Prove that an agent controls its claimed public key using a challenge-response signature.

```
POST /api/v1/agent/verify
Content-Type: application/json
```

### Request body

```json
{
  "publicKey": "<base64-encoded Ed25519 public key>",
  "challenge": "<random string>",
  "signature": "<base64-encoded Ed25519 signature of the challenge>"
}
```

The caller generates a random challenge string, sends it to the agent, and the agent signs it with its private key. The caller then submits both to this endpoint.

### Response

```json
{
  "verified": true,
  "signatureValid": true,
  "certified": true,
  "identityLevel": "concordium",
  "agent": {
    "wayidDid": "wayid:agent:7f3aB9cDe2FgHjKmNpQrSt4U",
    "displayName": "Acme Bot",
    "status": "active"
  }
}
```

| Field | Description |
|-------|-------------|
| `signatureValid` | Whether the Ed25519 signature is valid for the given challenge |
| `certified` | Whether the public key has a WayID certificate |
| `identityLevel` | Owner's identity verification provider (`concordium`, `mitid`, `worldid`), or `"unverified"` |

## Agent claiming

Used by agents to redeem a claim token during the [registration flow](/agents/claiming/).

```
POST /api/v1/claim
Content-Type: application/json
```

### Request body

```json
{
  "claimToken": "wayid-verify-a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
  "agentId": "acme-bot",
  "publicKey": "<base64-encoded Ed25519 public key>",
  "signature": "<base64-encoded Ed25519 signature of `${claimToken}|${agentId}`>"
}
```

| Field | Description |
|-------|-------------|
| `claimToken` | The `wayid-verify-{32-hex}` token from `POST /api/agents/token` |
| `agentId` | Operator-supplied sub-agent label inside the OpenClaw runtime. A single `device.json` keypair can stamp out distinct DIDs by pairing the same `publicKey` with different `agentId` values |
| `publicKey` | Base64-encoded Ed25519 public key from `device.json` |
| `signature` | Base64-encoded Ed25519 signature over the UTF-8 bytes of `${claimToken}|${agentId}` (token, literal pipe, agentId) |

### Response

```json
{
  "success": true,
  "message": "Claim verified",
  "wayidDid": "wayid:agent:7f3aB9cDe2FgHjKmNpQrSt4U"
}
```

| Field | Description |
|-------|-------------|
| `success` | `true` on a successful claim |
| `message` | Human-readable confirmation |
| `wayidDid` | The agent's freshly minted WayID DID. The agent should persist this to disk (e.g. `{openclaw}/workspace/wayid.json`). |

### Validation rules

- The claim token must exist and not be expired (10-minute TTL)
- The Ed25519 signature must be valid for the exact bytes `${claimToken}|${agentId}`
- The `(publicKey, agentId)` pair must not already be registered — re-claiming on the same key with a different `agentId` is allowed

## Error responses

All endpoints return errors in a consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description",
    "request_id": "req_a1b2c3d4e5f6g7h8"
  }
}
```

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `VALIDATION_ERROR` | 400 | Invalid request body or parameters |
| `INVALID_SIGNATURE` | 401 | Ed25519 signature verification failed |
| `NOT_FOUND` | 404 | No agent found for the given public key |
| `KEY_ALREADY_CLAIMED` | 409 | The `(publicKey, agentId)` pair is already registered |
| `TOKEN_EXPIRED` | 410 | Claim token has expired |
| `RATE_LIMITED` | 429 | Too many requests |

## Cryptographic details

WayID uses **Ed25519** for all agent key operations:

- **Public key**: 32 bytes, base64-encoded
- **Signature**: 64 bytes, base64-encoded
- **Message encoding**: UTF-8
- **Implementation**: Web Crypto API (`Ed25519` algorithm)
