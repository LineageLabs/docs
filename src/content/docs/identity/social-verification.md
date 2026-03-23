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
| **Website** | Upload a `.well-known/wayid.yml` file to your domain |

## How it works

1. On the wayID dashboard, add a social link (e.g. your X handle or website URL).
2. wayID generates a verification token in the format `wayid-verify-{16-hex-chars}`.
3. You publish the token on the platform using the instructions below.
4. Click **Verify** on the dashboard. wayID fetches your post/file and checks for the token.

## Platform-specific instructions

### X (Twitter)

Post a public tweet containing the text:

```
Verifying my wayID identity: wayid-verify-a1b2c3d4e5f6g7h8
```

Paste the URL of your tweet into the wayID dashboard and click Verify. wayID fetches the tweet via Twitter's oEmbed API and checks for your token.

Your account must be public — private/protected accounts cannot be verified.

### Bluesky

Post on Bluesky containing the text:

```
Verifying my wayID identity: wayid-verify-a1b2c3d4e5f6g7h8
```

Paste the URL of your post (e.g. `https://bsky.app/profile/you.bsky.social/post/abc123`) into the dashboard. wayID resolves your handle via the AT Protocol and fetches the post content.

### GitHub

Create a **public Gist** with any filename containing:

```
wayid-verify: wayid-verify-a1b2c3d4e5f6g7h8
```

Paste the Gist URL into the dashboard. wayID fetches the Gist via the GitHub API and searches all files for your token.

### Website

Create a file at `https://yourdomain.com/.well-known/wayid.yml`:

```yaml
wayid:
  version: 1
  verification_token: "wayid-verify-a1b2c3d4e5f6g7h8"
```

See the [.well-known/wayid.yml specification](/specifications/well-known/) for full details on file format and URL resolution.

## Verification tokens

Tokens are deterministic — they are derived from your user ID, platform, handle, and the timestamp when you added the link using HMAC-SHA256. The same token is shown each time you view your verification instructions. You don't need to save it.

## Retry behaviour

If verification fails on the first attempt, wayID retries up to 3 times with exponential backoff (2s, 4s, 8s delays). If all retries fail, the link is marked as **pending** and retried in the background. If background retries also fail, the status changes to **unverified** and you'll be notified.

## Removing a social link

You can remove a social link at any time from the dashboard. Removing a verified link reduces your trust score by 1 point. You can safely delete the tweet, Gist, or `.well-known` file after verification — wayID only checks the platform during the initial verification.
