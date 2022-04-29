import { getSpaces } from './lib/notion'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const spaces = await getSpaces()

  return new Response(JSON.stringify(spaces), {
    headers: { 'content-type': 'application/json' },
  })
}
