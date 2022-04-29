import { exportWorkspaces } from './lib/notion'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const data = await exportWorkspaces()

  return new Response(JSON.stringify(data), {
    headers: { 'content-type': 'application/json' },
  })
}
