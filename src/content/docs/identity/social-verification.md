---
title: Social Verification
description: Verify your social media accounts and website to strengthen your trust score.
---

Social verification lets you prove ownership of accounts on external platforms. Each verified social link adds 1 point to your [trust score](/certificate/trust-scores/).

## Supported platforms

| Platform | Proof method |
|----------|-------------|
| **X (Twitter)** | Post a tweet containing your verification token |
| **Bluesky** | Post on Bluesky containing your verification token |
| **GitHub** | Create a public Gist containing your verification token |
| **Website** | Upload a `.well-known/wayid.toml` file to your domain |

## How it works

1. On the WayID dashboard, add a social link (e.g. your X handle or website URL).
2. WayID generates a verification token in the format `wayid-verify-{16-hex-chars}`.
3. You publish the token on the platform using the instructions below.
4. Click **Verify** on the dashboard. WayID fetches your post/file and checks for the token.

## Platform-specific instructions

### X (Twitter)

Post a public tweet containing the text:

```
Verifying my WayID identity: wayid-verify-a1b2c3d4e5f6g7h8
```

Paste the URL of your tweet into the WayID dashboard and click Verify. WayID fetches the tweet via Twitter's oEmbed API and checks for your token.

Your account must be public — private/protected accounts cannot be verified.

### Bluesky

Post on Bluesky containing the text:

```
Verifying my WayID identity: wayid-verify-a1b2c3d4e5f6g7h8
```

Paste the URL of your post (e.g. `https://bsky.app/profile/you.bsky.social/post/abc123`) into the dashboard. WayID resolves your handle via the AT Protocol and fetches the post content.

### GitHub

Create a **public Gist** with any filename containing:

```
wayid-verify: wayid-verify-a1b2c3d4e5f6g7h8
```

Paste the Gist URL into the dashboard. WayID fetches the Gist's raw content (`gist.githubusercontent.com/.../raw`) and searches it for your token.

### Website

Create a file at `https://yourdomain.com/.well-known/wayid.toml`:

```toml
# WayID domain verification file
# See https://docs.way.je/verify-website for details

[wayid]
version = 1
verification_token = "wayid-verify-a1b2c3d4e5f6g7h8"
```

See the [.well-known/wayid.toml specification](/specifications/well-known/) for full details on file format and URL resolution.

## Verification tokens

Tokens are deterministic — they are derived using HMAC-SHA256 from your user ID, the platform, the handle or URL, and the social link's internal ID. The same token is shown each time you view your verification instructions, so you don't need to save it.

## Retry behaviour

If a check doesn't succeed immediately, WayID retries a few times with short exponential backoff before giving up. If it still doesn't succeed, the link is left **pending** and you can retry it from the dashboard. (Exact retry counts and delays may change.)

## Removing a social link

You can remove a social link at any time from the dashboard. Removing a verified link reduces your trust score by 1 point. You can safely delete the tweet, Gist, or `.well-known` file after verification — WayID only checks the platform during the initial verification.
