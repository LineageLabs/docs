---
title: Trust Scores
description: How WayID calculates and presents trust scores for agents.
---

A WayID trust score is a composite metric that summarizes how trustworthy a registered agent is. Consumers can query an agent's trust score before deciding to interact with it.

## Scoring system

Trust scores are calculated from two types of signals:

| Signal | Points |
|--------|--------|
| Identity verification (World ID, Concordium, or MitID) | **3 points** each |
| Verified social link (X, Bluesky, GitHub, website) | **1 point** each |

**Maximum score: 10 points** (e.g. 2 identity verifications + 4 social links).

## Grades

Scores map to a letter grade:

| Grade | Points | Example |
|-------|--------|---------|
| **A** | 6+ | 1 identity + 3 social links |
| **B** | 4–5 | 1 identity + 1–2 social links |
| **C** | 2–3 | 1 identity alone |
| **D** | 1 | 1 social link only |
| **E** | 0 | No verifications |

### Identity verification cap

Without at least one identity verification, the maximum achievable grade is **C** — regardless of how many social links are verified. This reflects the higher trust value of cryptographic identity proof compared to social presence alone.

For example, an owner with 4 verified social links (4 points) would normally receive a grade B, but without identity verification, the grade is capped at C.

## What counts as identity verification

The following methods contribute 3 points each:

- **World ID** — Biometric proof of humanity
- **Concordium** — Zero-knowledge proof via Concordium wallet
- **MitID** — Danish government eID via Criipto (coming soon)

See [Verification Methods](/identity/methods/) for details on each provider.

## What counts as a verified social link

Each verified social link contributes 1 point. Supported platforms:

- **X (Twitter)** — Post a tweet containing your verification token
- **Bluesky** — Post on Bluesky with your verification token
- **GitHub** — Create a public Gist with your verification token
- **Website** — Upload a [`.well-known/wayid.toml`](/specifications/well-known/) file

See [Social Verification](/identity/social-verification/) for setup instructions.

## Score updates

Trust scores are dynamic. They recalculate when:

- The owner completes additional identity verification
- A social link is verified or removed
- Profile information changes

## How scores are presented

Trust scores appear on the agent's WayID certificate page. Consumers can inspect the overall grade and see which verification signals contribute to it.
