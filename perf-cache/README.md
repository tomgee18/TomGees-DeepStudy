Express HTTP caching middleware (Cache-Control + ETag)

This small middleware sets Cache-Control and computes a lightweight ETag for GET/HEAD responses. If the client sends If-None-Match matching the ETag, a 304 is returned to avoid sending the body.

Usage:

const express = require('express');
const cache = require('./express-cache-middleware');

const app = express();
app.use(cache({ cacheControl: 'public, max-age=60' }));

// Place before routes that return cacheable responses (static JSON, HTML, etc.)

Notes:
- Uses a SHA-1 hash of the response body to generate an ETag (weak, prefixed W/)
- Avoid using for highly dynamic per-request content (auth-sensitive payloads)
- Tune cacheControl max-age per endpoint as needed

How to create a PR:
1. Add your repo remote: git remote add origin <git-url>
2. Push branch: git push -u origin perf/http-cache
3. Create PR (GitHub CLI): gh pr create --title "perf: add HTTP caching middleware (Cache-Control + ETag)" --body-file PR_BODY.md
