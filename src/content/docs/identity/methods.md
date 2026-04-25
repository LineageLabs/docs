---
title: Verification Methods
description: Identity verification methods supported by WayID.
---

WayID supports multiple identity verification methods. Each method provides a different level of assurance and contributes **3 points** to your agent's [trust score](/certificate/trust-scores/).

## MitID (eID)

[MitID](https://www.mitid.dk/) is the Danish national electronic identity system. It is the highest-assurance verification method currently available on WayID.

WayID integrates with MitID through [Criipto](https://criipto.com/) using OpenID Connect (OIDC):

1. You are redirected to the MitID login flow.
2. MitID confirms your identity and returns a signed attestation.
3. WayID records the verification result and extracts your nationality (ISO country code). No other personal data is stored.

Additional eID providers and regions are planned. Check the WayID dashboard for current availability.

## Concordium

[Concordium](https://concordium.com) is a layer-1 blockchain with built-in identity verification. WayID uses Concordium's zero-knowledge proof infrastructure to verify that an owner is a real, unique person — without running a Concordium node.

### How it works

1. You create a Concordium account (if you don't have one), which requires a one-time identity verification through a Concordium-approved identity provider.
2. You connect your Concordium wallet to WayID.
3. WayID requests a zero-knowledge proof — specifically, a `RevealAttribute` proof for the `idDocIssuer` attribute, which reveals your nationality without exposing any other personal data.
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

- **Nationality** — 2-letter ISO 3166-1 alpha-2 code (e.g. `DK`)
- **Proof reference** — Hash of the ZK proof (for audit, not PII)
- **Concordium account** — Wallet address used for the proof

No personal data (name, date of birth, etc.) is transmitted to or stored by WayID.

## World ID

[World ID](https://worldcoin.org/world-id) provides proof-of-humanity verification using biometric uniqueness checks.

_Coming soon._

## Self

[Self](https://self.xyz) is a self-sovereign identity protocol for privacy-preserving identity verification.

_Coming soon._

## Comparing methods

| Method | Assurance level | Privacy model | Availability | Points |
|--------|----------------|---------------|-------------|--------|
| MitID (eID) | High | Selective disclosure via OIDC | Denmark | 3 |
| Concordium | Medium–High | Zero-knowledge proofs | Global | 3 |
| World ID | Medium | Biometric uniqueness | Global | Coming soon |
| Self | Medium | Self-sovereign | Coming soon | Coming soon |

## Using multiple methods

You can verify your identity using more than one method. Each verification adds 3 points to your [trust score](/certificate/trust-scores/). An owner who has completed both MitID and Concordium verification (6 points) qualifies for an **A grade** — the highest trust tier.

## Social verification

In addition to identity verification, you can verify social accounts (X, Bluesky, GitHub, website) to further strengthen your trust score. See [Social Verification](/identity/social-verification/) for details.
