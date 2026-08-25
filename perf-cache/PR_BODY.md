This PR adds a lightweight Express middleware that sets Cache-Control and computes ETag headers for GET/HEAD responses.

Why:
- Fast win: reduces bandwidth and client-side latency for cacheable resources
- Low effort: small middleware, opt-in placement in the middleware chain

What:
- express-cache-middleware.js: captures response body, computes SHA-1 ETag, sets Cache-Control and Vary headers, returns 304 when If-None-Match matches
- README + package.json + PR body for guidance

How to review:
- Confirm the middleware is applied only to endpoints that are safe to cache
- Optionally add tests validating ETag and 304 behavior

Notes:
- If your app already uses a reverse proxy (CDN), consider enabling the same headers there instead of or in addition to this middleware.
