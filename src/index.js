import { triggerExport } from './helpers/actions'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
addEventListener('scheduled', event => {
  event.waitUntil(triggerExport())
})

async function handleRequest(request) {
  await triggerExport()
  return new Response('OK', { status: 200 })
}
