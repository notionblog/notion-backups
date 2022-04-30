import { triggerExport } from './helpers/actions'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
addEventListener('scheduled', event => {
  event.waitUntil(triggerExport())
})

async function handleRequest(request) {
  const { pathname } = new URL(request.url)
  if (pathname === '/test') await triggerExport()
  return new Response('OK', { status: 200 })
}
