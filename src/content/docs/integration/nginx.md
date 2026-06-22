---
title: NGINX edge verification
description: Verify the WayID of inbound agents at the NGINX edge, before traffic reaches your app.
---

[`wayid-nginx`](https://github.com/LineageLabs/wayid-nginx) verifies the WayID of inbound agents at
the NGINX edge — before a request ever reaches your application. It's a single `njs` handler plus a
sample config; passive v1 verification needs **no crypto**, so there's no sidecar process to run.

Like the [language SDKs](/integration/sdks/), it reads the self-asserted `WayID` request header,
resolves it against `{issuer}/api/v1/agent/{did}`, caches the result, and **fails open** by default.

## How it works

The `njs` handler (`njs/wayid.js`), wired with `js_content`, reads the header, resolves it, and:

- forwards `X-WayID-Decision` / `X-WayID-Verified` / `X-WayID-DID` / `X-WayID-Identity-Level` /
  `X-WayID-Status` to your upstream (via `js_var`s), then `internalRedirect`s to it;
- returns `403` instead when `$wayid_enforce` is `on` and the decision is `deny`.

Resolutions are cached in a shared dict for the zone TTL, so the edge doesn't hit the issuer on
every request.

> **Why `js_content`, not `auth_request`?** njs's `ngx.fetch` does not run inside an `auth_request`
> subrequest, so the natural-looking `auth_request` design doesn't work for a handler that calls the
> issuer. The working pattern is `js_content` → resolve → `internalRedirect` to the upstream. (If
> your NGINX build lacks njs, you can instead run the JS package's `withWayId` worker adapter as a
> small HTTP service and point `auth_request` at it.)

## Install

1. Build/run NGINX with the njs module (`ngx_http_js_module`). On Debian/Ubuntu:
   `apt-get install nginx-module-njs`, then `load_module modules/ngx_http_js_module.so;`. The
   official `nginx` Docker image already ships the module.
2. Copy `njs/wayid.js` to `/etc/nginx/njs/`.
3. In `http {}`:

   ```nginx
   js_path   "/etc/nginx/njs/";
   js_import wayid from wayid.js;
   js_var    $wayid_decision;
   js_var    $wayid_verified;
   js_var    $wayid_did;
   js_var    $wayid_level;
   js_var    $wayid_status;
   resolver  1.1.1.1 ipv6=off;                    # ngx.fetch needs a resolver
   js_shared_dict_zone zone=wayid:1m timeout=60s; # optional resolution cache
   ```

4. Use `conf/wayid.conf` as the template for the `server {}` block — a `location /` with
   `js_content wayid.gate;` and an `internal` `location @wayid_upstream` that `proxy_pass`es to your
   app.

## Configuration

| nginx variable            | default          | meaning                                            |
| ------------------------- | ---------------- | -------------------------------------------------- |
| `$wayid_issuer`           | `https://way.je` | issuer origin that minted the DIDs                 |
| `$wayid_enforce`          | `off`            | `on` ⇒ return `403` on a `deny` decision           |
| `$wayid_require_verified` | `off`            | `on` ⇒ require owner `identityLevel == "verified"` |

## Distribution

There's no package-registry artifact — it's a single handler plus a sample config. Get it one of two
ways:

- **Tagged GitHub release (recommended).** Each `v*` tag publishes a release with `njs/wayid.js` and
  `conf/wayid.conf` attached. Download `wayid.js`, drop it in `/etc/nginx/njs/`, and wire up your
  config.
- **Clone / vendor.** Copy `njs/wayid.js` into your repo or config management (Ansible, Docker
  build, etc.). Pin to a tag for reproducibility.

## Test

`test/run.sh` in the repo runs the handler in real NGINX + njs (Docker) against a mock issuer and
asserts allow / deny / flag behaviour.

## Status

Prototype for WayID issue [#373](https://github.com/LineageLabs/way-id/issues/373). Passive v1 only;
cryptographic proof-of-possession (v2) is a planned layer — see
[Verified Agent Gateway](/integration/gateway/).
