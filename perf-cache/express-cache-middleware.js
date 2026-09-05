const crypto = require('crypto');

// Express middleware: sets Cache-Control and ETag, and handles If-None-Match (304)
// Options: { cacheControl: 'public, max-age=60', vary: 'Accept-Encoding' }
module.exports = function httpCacheMiddleware(options = {}) {
  const cacheControl = options.cacheControl || 'public, max-age=60';
  const vary = options.vary || 'Accept-Encoding';

  return function (req, res, next) {
    // Only for GET/HEAD
    if (!(req.method === 'GET' || req.method === 'HEAD')) return next();

    // Short-circuit for explicit no-cache request
    const reqCacheControl = req.headers['cache-control'] || '';
    if (reqCacheControl.includes('no-cache') || reqCacheControl.includes('no-store')) return next();

    // Set cache headers early to avoid always buffering the response
    const MAX_ETAG_SIZE = options.maxEtagSize || 64 * 1024; // 64KB
    if (!res.getHeader('Cache-Control')) res.setHeader('Cache-Control', cacheControl);
    if (!res.getHeader('Vary') && vary) res.setHeader('Vary', vary);

    // Capture body chunks (but avoid buffering large responses)
    const origWrite = res.write;
    const origEnd = res.end;

    let bodySize = 0;
    let finished = false;
    const hash = crypto.createHash('sha1');
    let buffering = true; // whether we are still buffering to compute an ETag
    let bufferedChunks = [];

    res.write = function (chunk, ...args) {
      try {
        if (chunk) {
          const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
          // update streaming hash always (cheap)
          try { hash.update(buf); } catch (e) { /* ignore */ }

          // buffer only while under threshold to avoid high memory usage
          if (buffering) {
            if (bodySize + buf.length <= MAX_ETAG_SIZE) {
              bufferedChunks.push(buf);
            } else {
              // stop buffering and free already-buffered memory
              buffering = false;
              bufferedChunks = null;
            }
          }

          bodySize += buf.length;
        }
      } catch (e) {
        // ignore
      }
      return origWrite.apply(res, [chunk, ...args]);
    };

    res.end = function (chunk, ...args) {
      if (finished) return;
      finished = true;
      try {
        if (chunk) {
          const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
          try { hash.update(buf); } catch (e) { /* ignore */ }

          if (buffering) {
            if (bodySize + buf.length <= MAX_ETAG_SIZE) {
              bufferedChunks.push(buf);
            } else {
              buffering = false;
              bufferedChunks = null;
            }
          }

          bodySize += buf.length;
        }

        // Only set caching for successful responses with a body
        const statusCode = res.statusCode || 200;
        if (statusCode >= 200 && statusCode < 300) {
          if (buffering && bufferedChunks && bufferedChunks.length > 0) {
            // compute ETag from streamed hash (we buffered the full body)
            const hashHex = hash.digest('hex');
            const etag = `W/"${hashHex}"`;

            // Set headers if not already set
            if (!res.getHeader('Cache-Control')) res.setHeader('Cache-Control', cacheControl);
            if (!res.getHeader('ETag')) res.setHeader('ETag', etag);
            if (!res.getHeader('Vary') && vary) res.setHeader('Vary', vary);

            const inm = req.headers['if-none-match'];
            if (inm && inm.split(',').map(s => s.trim()).includes(etag)) {
              // Client already has current content
              res.statusCode = 304;
              // Remove body-related headers
              res.removeHeader('Content-Type');
              res.removeHeader('Content-Length');
              return origEnd.apply(res, ['', ...args]);
            }
          } else {
            // Not buffering (response too large) — skip setting ETag to avoid buffering and heavy work
            if (!res.getHeader('Cache-Control')) res.setHeader('Cache-Control', cacheControl);
            if (!res.getHeader('Vary') && vary) res.setHeader('Vary', vary);
          }
        }
      } catch (e) {
        // If ETag fails, just proceed
      }
      return origEnd.apply(res, [chunk, ...args]);
    };

    // proceed
    next();
  };
};
