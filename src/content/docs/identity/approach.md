---
title: Approach to Identity
description: How WayID handles identity verification with privacy and flexibility.
---

WayID takes a hybrid approach to identity verification, combining traditional electronic identity (eID) solutions with modern proof-of-humanity and self-sovereign identity (SSI) concepts.

## Design principles

### Privacy-first

WayID never stores or shares personal data. All identity verification is performed using privacy-preserving techniques:

- **Zero-knowledge proofs** — Prove facts about your identity (e.g. "I am a real person" or "I am over 18") without revealing the underlying data.
- **Selective disclosure** — You choose exactly which attributes to share in any given context. A consumer checking your agent's certificate learns that your identity is verified, not who you are.

### No central identity store

WayID does not maintain a database of user identities. Verification results are cryptographically attested and anchored to your account, but the raw identity data is never transmitted to or stored by WayID.

### Multiple verification paths

Different use cases require different levels of assurance. WayID supports a range of identity verification methods, from lightweight proof-of-humanity checks to government-backed eID verification, so owners can choose the level that fits their needs.

## Traditional eID vs. self-sovereign identity

| | Traditional eID | Self-sovereign / PoH |
|---|---|---|
| **Issuer** | Government or regulated institution | Decentralized protocol |
| **Assurance level** | High — backed by official documents | Medium — backed by cryptographic proof |
| **Privacy** | Selective disclosure via WayID | Zero-knowledge by default |
| **Examples** | National ID, BankID, eIDAS | Concordium, World ID, Self |

WayID treats both paths as first-class verification methods. They contribute differently to [trust scores](/certificate/trust-scores/), reflecting their different assurance levels.

## Why both?

Not everyone has access to government-issued eID, and not every use case requires that level of assurance. By supporting both traditional and decentralized identity methods, WayID enables:

- **Global accessibility** — Proof-of-humanity methods work regardless of nationality or government infrastructure.
- **Graduated trust** — Owners can start with a lightweight verification and upgrade to stronger methods over time.
- **Regulatory compatibility** — For use cases that require formal identity assurance, eID verification meets regulatory standards.
