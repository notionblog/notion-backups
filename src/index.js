import { triggerExport } from './helpers/actions'
import home from '../pages/home.html'
import error from '../pages/error.html'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})
addEventListener('scheduled', event => {
  event.waitUntil(triggerExport())
})

async function handleRequest(event) {
  const { pathname } = new URL(event.request.url)

  if (typeof TOKEN_V2 === 'undefined') {
    return new Response(error, {
      headers: {
        'content-type': 'text/html',
      },
    })
  }

  if (pathname === '/test') {
    if (typeof MODE !== 'undefined' && MODE == 'test') {
      event.waitUntil(triggerExport())
      return new Response('OK', { status: 200 })
    } else {
      return new Response(
        'Failed to trigger the script, please enable test mode',
        { status: 400 },
      )
    }
  }

  return new Response(home, {
    headers: {
      'content-type': 'text/html',
    },
  })
}
