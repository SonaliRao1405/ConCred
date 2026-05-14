import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'

const host = '127.0.0.1'
const port = 4173
const root = join(process.cwd(), 'dist')

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function safeResolve(urlPath) {
  const cleanPath = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '')
  return join(root, cleanPath)
}

function sendFile(response, filePath) {
  const fileExtension = extname(filePath)
  response.writeHead(200, {
    'Content-Type': mimeTypes[fileExtension] ?? 'application/octet-stream',
  })
  createReadStream(filePath).pipe(response)
}

const server = createServer((request, response) => {
  try {
    const urlPath = request.url === '/' ? '/index.html' : request.url
    const candidatePath = safeResolve(urlPath)
    const existingPath =
      existsSync(candidatePath) && statSync(candidatePath).isFile() ? candidatePath : join(root, 'index.html')

    sendFile(response, existingPath)
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end(`Server error: ${error.message}`)
  }
})

server.listen(port, host, () => {
  console.log(`ConservationCred static server running at http://${host}:${port}/`)
})
