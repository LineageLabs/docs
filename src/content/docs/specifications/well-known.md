---
title: .well-known/wayid.toml
description: Website verification using the .well-known standard (RFC 8615).
---

WayID uses the [IETF RFC 8615](https://datatracker.ietf.org/doc/html/rfc8615) `.well-known` standard for website ownership verification. By placing a `wayid.toml` file at a well-known URI on your domain, you prove that you control the website.

## How it works

1. On the WayID dashboard, add your website as a social link.
2. WayID generates a verification token (format: `wayid-verify-{16-hex-chars}`).
3. You create a file at `https://yourdomain.com/.well-known/wayid.toml` with the token.
4. WayID fetches the file and confirms the token matches.

## File format

Create a file named `wayid.toml` in the `/.well-known/` directory of your website's root:

```toml
# WayID domain verification file
# See https://way.je/docs/verify-website for details

[wayid]
version = 1
verification_token = "wayid-verify-a1b2c3d4e5f6g7h8"
```

| Field | Required | Description |
|-------|----------|-------------|
| `version` | Yes | Must be `1` |
| `verification_token` | Yes | The token provided by WayID during setup |

The `[permissions]` and `[agent]` section namespaces are reserved for future use.

## Verification rules

WayID performs the following checks:

1. **URL resolution** — Your domain is normalized and tried in order:
   - `https://{domain}`
   - `https://www.{domain}`
   - `http://{domain}`

2. **File fetch** — WayID requests `{base}/.well-known/wayid.toml` from each candidate URL until one succeeds.

3. **Token match** — The file contents must contain your exact verification token.

4. **HTTP status** — The server must return a 2xx status code.

Verification requests have a 10-second timeout and retry up to 3 times with exponential backoff (2s, 4s, 8s).

## Example

If your domain is `example.com` and your verification token is `wayid-verify-a1b2c3d4e5f6g7h8`, create this file:

**URL:** `https://example.com/.well-known/wayid.toml`

```toml
# WayID domain verification file
# See https://way.je/docs/verify-website for details

[wayid]
version = 1
verification_token = "wayid-verify-a1b2c3d4e5f6g7h8"
```

## Token generation

Verification tokens are deterministic HMAC-SHA256 signatures derived from your user ID, platform, handle, and creation timestamp. The same token is regenerated each time you view your verification instructions — you don't need to store it.

## Common issues

**File not found (404)**
Ensure the file is served at the exact path `/.well-known/wayid.toml`. Some hosting platforms require explicit configuration to serve files from `.well-known/` directories.

**HTTPS required**
WayID tries HTTPS first. If your site only serves HTTP, verification will still work as a fallback, but HTTPS is strongly recommended.

**CDN or proxy caching**
If you use a CDN, the file might be cached. Clear your CDN cache or wait for the TTL to expire before retrying verification.
