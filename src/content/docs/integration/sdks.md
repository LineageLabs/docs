---
title: SDKs
description: Client libraries for verifying WayID agents at your gateway.
---

The **wayid-verify** SDK lets a gateway, reverse proxy, or API backend answer _"what kind of
agent is calling me?"_ in one call — no user flow, and no crypto to stand up. Each package wraps
the public [`GET /api/v1/agent/{did}`](/specifications/api-reference/) lookup behind a resolver, an
in-memory TTL cache, and a policy helper, with adapters for common frameworks.

| Package                     | Language                                       | Adapters                   | Repo                                                                      |
| --------------------------- | ---------------------------------------------- | -------------------------- | ------------------------------------------------------------------------- |
| `@lineagelabs/wayid-verify` | TypeScript (Node 18+, Bun, Cloudflare Workers) | Express, Fetch/Worker      | [`wayid-verify`](https://github.com/LineageLabs/wayid-verify) (`js/`)     |
| `wayid-verify`              | Python 3.9+                                    | FastAPI / Starlette, Flask | [`wayid-verify`](https://github.com/LineageLabs/wayid-verify) (`python/`) |
| `wayid-nginx`               | NGINX (njs)                                    | `js_content` edge handler  | [`wayid-nginx`](https://github.com/LineageLabs/wayid-nginx)               |

Both language packages are **dependency-free**. The NGINX integration has its own page —
see [NGINX edge verification](/integration/nginx/).

## How it works

An agent declares its identity with a request header:

```
WayID: wayid:agent:{24-char-base58}      # full DID or the bare 24-char tail
```

The SDK extracts the header, resolves it against the issuer, caches the result, and produces a
**decision** — `allow`, `deny`, or `flag`. By default it **fails open**: a verifier outage, an
unknown DID, or a missing header never blocks traffic (the request is tagged, not rejected). This
is **identification, not authentication** — the v1 header is self-asserted. See the
[Verified Agent Gateway](/integration/gateway/) page for the trust model.

## Install

```bash
npm install @lineagelabs/wayid-verify     # Node / Bun / Cloudflare Workers
pip install wayid-verify                  # Python 3.9+
```

> **Not on the registries yet.** Until the packages are published to npm / PyPI, install them
> straight from GitHub:
>
> ```bash
> # Python — installs from the repo subdirectory in one step
> pip install "git+https://github.com/LineageLabs/wayid-verify.git#subdirectory=python"
>
> # JavaScript — install the tarball attached to a tagged release
> npm install https://github.com/LineageLabs/wayid-verify/releases/download/js-v0.1.0/lineagelabs-wayid-verify-0.1.0.tgz
> ```

## TypeScript / JavaScript

### Express

```ts
import express from "express";
import { wayIdMiddleware } from "@lineagelabs/wayid-verify/express";

const app = express();
app.use(wayIdMiddleware({ issuer: "https://way.je" }));

app.get("/", (req, res) => {
  // req.wayid.decision -> "allow" | "deny" | "flag"
  // req.wayid.resolution.identityLevel, .did, .status
  res.json({ agent: req.wayid?.resolution.did ?? null });
});
```

By default the middleware **tags** the request (attaches `req.wayid`, forwards `X-WayID-*`
headers) but does not block. Pass `enforce: true` to return `403` on a `deny` decision.

### Cloudflare Workers / Fetch

```ts
import { withWayId } from "@lineagelabs/wayid-verify/worker";

export default {
  fetch: withWayId(
    async (request, result) => {
      // result.decision, result.resolution
      return new Response(`Hello, ${result.resolution.did ?? "unknown agent"}`);
    },
    { issuer: "https://way.je", enforce: false },
  ),
};
```

### Core resolver (framework-agnostic)

```ts
import { WayIDClient, decide } from "@lineagelabs/wayid-verify";

const client = new WayIDClient({ issuer: "https://way.je" });
const resolution = await client.resolve("wayid:agent:7f3aB9cDe2FgHjKmNpQrSt4U");
const decision = decide(resolution, { requireVerified: true }); // "allow" | "deny" | "flag"
```

## Python

### FastAPI / Starlette

```python
from wayid_verify.asgi import WayIDMiddleware

app.add_middleware(WayIDMiddleware, issuer="https://way.je")

@app.get("/")
def root(request):
    # request.state.wayid.decision -> "allow" | "deny" | "flag"
    return {"agent": request.state.wayid.resolution.did}
```

### Flask

```python
from wayid_verify.flask_ext import wayid_before_request

app.before_request(wayid_before_request(issuer="https://way.je"))
# then read flask.g.wayid in a view
```

### Core resolver

```python
from wayid_verify import WayIDClient, verify_headers, Policy

client = WayIDClient(issuer="https://way.je")
result = verify_headers(request.headers, client, Policy(require_verified=False))
# result.resolution.identity_level, result.decision
```

Set `enforce=True` on the middleware (or `Policy(fail_closed=True)`) to deny instead of tag.

## Configuration

| Option                   | Default          | Meaning                                                    |
| ------------------------ | ---------------- | ---------------------------------------------------------- |
| `issuer`                 | `https://way.je` | Origin that minted the DIDs                                |
| `timeoutMs` / `timeout`  | `2000`           | Per-lookup timeout                                         |
| `cacheTtlMs`             | `60000`          | TTL for found results                                      |
| `negativeCacheTtlMs`     | `10000`          | TTL for `404` (not-found) results                          |
| `policy.requireVerified` | `false`          | Require the owner identity to be `verified`                |
| `policy.allowStatuses`   | `["active"]`     | Certificate statuses that may pass                         |
| `policy.failClosed`      | `false`          | Deny (instead of fail open) when the lookup can't complete |

### Decision semantics

- **`allow`** — registered, active, and meets the identity bar.
- **`deny`** — present but fails policy (wrong status, or unverified when required), or absent/failed under a strict (`failClosed` / `requireVerified`) policy.
- **`flag`** — present-but-unknown, or a fail-open outage: serve the request but tag it for logging.

### Forwarded headers

When tagging, the SDK forwards these to your upstream so the app can read the verified identity
without repeating the lookup:

```
X-WayID-Decision         allow | deny | flag
X-WayID-Verified         true | false
X-WayID-DID              wayid:agent:...
X-WayID-Identity-Level   verified | unverified
X-WayID-Status           active | suspended | revoked
```

## Status

Prototype for WayID issue [#373](https://github.com/LineageLabs/way-id/issues/373). The canonical
wire contract lives in the way-id repo (`.specs/product-spec.md` §4.6 / `.specs/tech-spec.md` §5.5).
Cryptographic proof-of-possession (v2) is a planned layer built on Web Bot Auth / RFC 9421 — see
[Verified Agent Gateway](/integration/gateway/).
