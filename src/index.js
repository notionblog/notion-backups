import { exportWorkspaces } from './lib/notion'
import { notify } from './lib/notify'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const tasks = await exportWorkspaces()
  await notify(tasks, 'slack')
  return new Response(JSON.stringify(tasks), {
    headers: { 'content-type': 'application/json' },
  })
}
