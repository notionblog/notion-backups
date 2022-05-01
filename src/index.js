import { triggerExport } from './helpers/actions'
import home from '../pages/home.html'
import error from '../pages/error.html'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
addEventListener('scheduled', event => {
  event.waitUntil(triggerExport())
})

async function handleRequest(request) {
  const { pathname } = new URL(request.url)

  if (typeof TOKEN_V2 === 'undefined') {
    return new Response(error, {
      headers: {
        'content-type': 'text/html',
      },
    })
  }

  if (pathname === '/test' && typeof MODE !== 'undefined' && MODE == 'test')
    await triggerExport()
  return new Response(home, {
    headers: {
      'content-type': 'text/html',
    },
  })
}
