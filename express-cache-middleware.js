const crypto = require('crypto');

// Express middleware: sets Cache-Control and ETag, and handles If-None-Match (304)
// Options: { cacheControl: 'public, max-age=60', vary: 'Accept-Encoding', maxEtagSize }
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

    // Prepare incremental hash so responses do not need full buffering
    const origWrite = res.write;
    const origEnd = res.end;

    let bodySize = 0;
    let finished = false;
    let hash = crypto.createHash('sha1');
    let hashingActive = true; // stop hashing if body grows too large to save CPU

    res.write = function (chunk, ...args) {
      try {
        if (chunk) {
          const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
          bodySize += buf.length;
          if (hashingActive) {
            hash.update(buf);
            if (bodySize > MAX_ETAG_SIZE) {
              // too large to justify hashing further; disable to save CPU
              hashingActive = false;
              hash = null;
            }
          }
        }
      } catch (e) {
        // ignore hashing errors and continue streaming
        hashingActive = false;
        hash = null;
      }
      return origWrite.apply(res, [chunk, ...args]);
    };

    res.end = function (chunk, ...args) {
      if (finished) return;
      finished = true;
      try {
        if (chunk) {
          const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
          bodySize += buf.length;
          if (hashingActive) {
            hash.update(buf);
            if (bodySize > MAX_ETAG_SIZE) {
              hashingActive = false;
              hash = null;
            }
          }
        }

        // Only set caching for successful responses
        const statusCode = res.statusCode || 200;
        if (statusCode >= 200 && statusCode < 300) {
          // Only set ETag if body small enough to justify; avoid buffering while still supporting ETag for typical small responses
          if (hashingActive && hash) {
            const hashHex = hash.digest('hex');
            const etag = `W/\"${hashHex}\"`;
n            // Set headers if not already set
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
