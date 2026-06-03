---
title: Verification Methods
description: Identity verification methods supported by WayID.
---

WayID supports multiple identity verification methods. Each method provides a different level of assurance and contributes **3 points** to your agent's [trust score](/certificate/trust-scores/).

## World ID

[World ID](https://worldcoin.org/world-id) provides proof-of-humanity verification using biometric uniqueness checks. It confirms that an owner is a real, unique human without revealing who they are.

### How it works

1. You verify your humanity in the World App (Orb or device-based verification) and generate a zero-knowledge proof.
2. WayID submits the proof to the World ID verification API for server-side validation.
3. WayID records the verification result against your account. No biometric data or personal information is stored.

## Concordium

[Concordium](https://concordium.com) is a layer-1 blockchain with built-in identity verification. WayID uses Concordium's zero-knowledge proof infrastructure to verify that an owner is a real, unique person — without running a Concordium node.

### How it works

1. You create a Concordium account (if you don't have one), which requires a one-time identity verification through a Concordium-approved identity provider.
2. You connect your Concordium wallet to WayID.
3. WayID requests a zero-knowledge proof — specifically, a `RevealAttribute` proof for the `idDocIssuer` attribute. The proof confirms that you hold a mainnet identity issued by an approved provider, without revealing any personal data.
4. The proof is verified off-chain and recorded on your WayID account.

### Wallet support

| Wallet | Connection method |
|--------|------------------|
| **Concordium Browser Wallet** (Chrome/Firefox) | Browser extension — auto-detected |
| **CryptoX Wallet** (mobile) | WalletConnect v2 via Reown — scan QR code |
| **Concordium Mobile Wallet** | WalletConnect v2 via Reown — scan QR code |

### Requirements

- **Mainnet only** — Testnet identities have no trust value and are not accepted.
- Issuers 0–4 are accepted (all mainnet-approved Concordium identity providers).

### What is stored

- **Proof reference** — Hash of the ZK proof (for audit, not PII)
- **Concordium account** — Wallet address used for the proof

No personal data — nationality, name, date of birth, document content, etc. — is extracted from the proof or stored by WayID. The verification only attests that you hold a mainnet identity issued by an approved provider.

## MitID (eID)

[MitID](https://www.mitid.dk/) is the Danish national electronic identity system. WayID plans to integrate MitID through [Criipto](https://criipto.com/) using OpenID Connect (OIDC) as its first government-backed eID method.

_Coming soon._

## Self

[Self](https://self.xyz) is a self-sovereign identity protocol for privacy-preserving identity verification.

_Coming soon._

## Comparing methods

| Method | Assurance level | Privacy model | Availability | Points |
|--------|----------------|---------------|-------------|--------|
| World ID | Medium | Biometric uniqueness (ZK) | Global | 3 |
| Concordium | Medium–High | Zero-knowledge proofs | Global | 3 |
| MitID (eID) | High | Selective disclosure via OIDC | Denmark | Coming soon |
| Self | Medium | Self-sovereign | Coming soon | Coming soon |

## Using multiple methods

You can verify your identity using more than one method. Each verification adds 3 points to your [trust score](/certificate/trust-scores/). An owner who has completed two identity verifications (6 points) qualifies for an **A grade** — the highest trust tier.

## Social verification

In addition to identity verification, you can verify social accounts (X, Bluesky, GitHub, website) to further strengthen your trust score. See [Social Verification](/identity/social-verification/) for details.
