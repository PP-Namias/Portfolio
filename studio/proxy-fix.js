/* Simple proxy that forwards requests to the running Sanity Studio dev server
   and normalizes generated HTML (removes stray CR characters that break the
   client runtime path on Windows). Run with: `node proxy-fix.js` and open
   http://localhost:3334 instead of :3333 while developing.
*/
const http = require('http')
const { URL } = require('url')

const TARGET = { hostname: 'localhost', port: 3333 }
const PORT = 3334

const server = http.createServer((req, res) => {
  const options = {
    hostname: TARGET.hostname,
    port: TARGET.port,
    path: req.url,
    method: req.method,
    headers: req.headers,
  }

  const proxyReq = http.request(options, (proxyRes) => {
    const chunks = []
    proxyRes.on('data', (chunk) => chunks.push(chunk))
    proxyRes.on('end', () => {
      let body = Buffer.concat(chunks)
      const contentType = proxyRes.headers['content-type'] || ''

      // If HTML, sanitize carriage returns that break the runtime path
      if (contentType.includes('text/html')) {
        let s = body.toString()
        // Remove literal backslash+r sequences ("\\r") and any stray backslashes
        // immediately before "runtime", then normalize double-backslashes.
        // Remove actual CR characters and literal backslash+r sequences
        s = s.replace(/\r/g, '')
        s = s.replace(/\\r/g, '')
        // Normalize the runtime src path if it contains backslashes
        s = s.replace(/src="\/\.sanity\\+runtime/gi, 'src="/.sanity/runtime')
        // Replace stray backslashes before 'runtime' and any remaining backslashes
        s = s.replace(/\\(?=runtime)/g, '/')
        s = s.replace(/\\/g, '/')
        body = Buffer.from(s)
      }

      // Copy response headers (but fix content-length)
      const headers = { ...proxyRes.headers }
      headers['content-length'] = Buffer.byteLength(body)

      res.writeHead(proxyRes.statusCode || 200, headers)
      res.end(body)
    })
  })

  proxyReq.on('error', (err) => {
    res.writeHead(502, { 'content-type': 'text/plain' })
    res.end('Bad gateway: ' + String(err))
  })

  req.pipe(proxyReq)
})

server.listen(PORT, () => {
  console.log(`Proxy running at http://localhost:${PORT} -> http://${TARGET.hostname}:${TARGET.port}`)
})
