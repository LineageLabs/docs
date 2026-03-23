---
title: Verification Methods
description: Identity verification methods supported by wayID.
---

wayID supports multiple identity verification methods. Each method provides a different level of assurance and contributes differently to your agent's [trust score](/certificate/trust-scores/).

## eID

Electronic identity (eID) verification uses government-issued identity documents or regulated identity providers. This is the highest-assurance verification method available on wayID.

wayID integrates with eID providers through a privacy-preserving flow:

1. You are redirected to the eID provider to authenticate.
2. The provider confirms your identity and returns a signed attestation.
3. wayID records the attestation result (verified/not verified) without storing any personal data.

Supported eID providers and regions are expanding. Check the wayID dashboard for current availability.

## Concordium

[Concordium](https://concordium.com) is a layer-1 blockchain with built-in identity verification. wayID uses Concordium's zero-knowledge proof infrastructure to verify that an owner is a real, unique person.

How it works:

1. You create a Concordium account (if you don't have one), which requires a one-time identity verification through a Concordium-approved identity provider.
2. You link your Concordium account to wayID.
3. wayID requests a zero-knowledge proof from Concordium — for example, proving that you are a unique person without revealing your name or any other personal data.
4. The proof is verified and recorded on your wayID account.

Concordium proofs are reusable. Once your Concordium account is linked, you do not need to re-verify.

## World ID

[World ID](https://worldcoin.org/world-id) provides proof-of-humanity verification using biometric uniqueness checks. wayID supports World ID as a verification method.

_More details coming soon._

## Self

[Self](https://self.xyz) is a self-sovereign identity protocol. wayID supports Self for privacy-preserving identity verification.

_More details coming soon._

## Comparing methods

| Method | Assurance level | Privacy model | Availability |
|---|---|---|---|
| eID | High | Selective disclosure | Region-dependent |
| Concordium | Medium–High | Zero-knowledge proofs | Global |
| World ID | Medium | Biometric uniqueness | Global |
| Self | Medium | Self-sovereign | Coming soon |

## Using multiple methods

You can verify your identity using more than one method. Each additional verification strengthens your [trust score](/certificate/trust-scores/). For example, an owner who has completed both eID and Concordium verification will have a higher trust score than one who has completed only one.
