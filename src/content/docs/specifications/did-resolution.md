---
title: DID Resolution
description: How WayID DIDs resolve to W3C DID documents.
---

WayID supports [W3C DID Core](https://www.w3.org/TR/did-core/) resolution. Any WayID agent DID can be resolved to a standards-compliant DID document containing the agent's public key, authentication methods, and service endpoints.

## Resolving a DID

Request an agent's record with the `Accept: application/did+json` header:

```
GET /api/agents/{wayidDid}
Accept: application/did+json
```

For example:

```
GET /api/agents/wayid:agent:7f3aB9cDe2FgHjKmNpQrSt4U
Accept: application/did+json
```

Without the `application/did+json` accept header, the endpoint returns the standard JSON agent object instead.

## DID document structure

```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/jws-2020/v1"
  ],
  "id": "did:web:way.je:agent:wayid:agent:7f3aB9cDe2FgHjKmNpQrSt4U",
  "controller": "did:web:way.je:agent:wayid:agent:7f3aB9cDe2FgHjKmNpQrSt4U",
  "verificationMethod": [
    {
      "id": "did:web:way.je:agent:wayid:agent:7f3aB9cDe2FgHjKmNpQrSt4U#key-1",
      "type": "Ed25519VerificationKey2020",
      "controller": "did:web:way.je:agent:wayid:agent:7f3aB9cDe2FgHjKmNpQrSt4U",
      "publicKeyBase64": "<base64-encoded Ed25519 public key>"
    }
  ],
  "authentication": [
    "did:web:way.je:agent:wayid:agent:7f3aB9cDe2FgHjKmNpQrSt4U#key-1"
  ],
  "service": [
    {
      "id": "did:web:way.je:agent:wayid:agent:7f3aB9cDe2FgHjKmNpQrSt4U#agent-service",
      "type": "AgentService",
      "serviceEndpoint": "https://way.je/api/agents/wayid:agent:7f3aB9cDe2FgHjKmNpQrSt4U"
    }
  ]
}
```

## DID method

WayID uses the [`did:web`](https://w3c-ccg.github.io/did-method-web/) method. The full DID is constructed as:

```
did:web:{hostname}:agent:{wayidDid}
```

For the production deployment at `way.je`, this becomes:

```
did:web:way.je:agent:wayid:agent:7f3aB9cDe2FgHjKmNpQrSt4U
```

## Document fields

### verificationMethod

Contains the agent's Ed25519 public key. The key is 32 bytes, base64-encoded. Key type is `Ed25519VerificationKey2020` per the [W3C JWS 2020 suite](https://w3id.org/security/suites/jws-2020/v1).

### authentication

References the verification method used to authenticate the agent. The agent can prove it controls this key via challenge-response signing (see [Verification API](/specifications/api-reference/)).

### service

Lists service endpoints associated with the agent. The `AgentService` endpoint points to the agent's JSON record on the WayID API.

## Validation

WayID DIDs must match the following pattern:

```
wayid:agent:{24 base58 characters}
```

Regex: `^wayid:agent:[1-9A-HJ-NP-Za-km-z]{24}$`

The base58 alphabet is the Bitcoin variant — it excludes `0`, `O`, `I`, and `l` to avoid visual ambiguity.
