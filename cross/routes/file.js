var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  /* req
_readableState, readable, domain, _events, _eventsCount, _maxListeners, socket, connection, httpVersionMajor, httpVersionMinor, httpVersion, complete, headers, rawHeaders, trailers, rawTrailers, upgrade, url, method, statusCode, statusMessage, client, _consuming, _dumped, next, baseUrl, originalUrl, _parsedUrl, params, query, res, _startAt, _startTime, _remoteAddress, body, _body, length, read, secret, cookies, signedCookies, route
  */
  /* res
domain, _events, _eventsCount, _maxListeners, output, outputEncodings, outputCallbacks, outputSize, writable, _last, upgrading, chunkedEncoding, shouldKeepAlive, useChunkedEncodingByDefault, sendDate, _removedHeader, _contentLength, _hasBody, _trailer, finished, _headerSent, socket, connection, _header, _headers, _headerNames, _onPendingData, req, locals, _startAt, _startTime, writeHead, __onFinished
  */
  
  res.send("<script>document.domain='tt.com';window.parent.seta({ path: 'http://www.baidu.com' })</script>");
});

module.exports = router;
