import { triggerExport } from './helpers/actions'
import home from '../html/home.html'
import error from '../html/error.html'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
addEventListener('scheduled', event => {
  event.waitUntil(triggerExport())
})

async function handleRequest(request) {
  const { pathname } = new URL(request.url)

  if (typeof TOKEN_V2 === 'undefined') {
    console.log('YEES')
    return new Response(error, {
      headers: {
        'content-type': 'text/html',
      },
    })
  }
  // if (pathname === '/test') await triggerExport()
  return new Response(home, {
    headers: {
      'content-type': 'text/html',
    },
  })
}
