import { exportWorkspaces } from '../lib/notion'
import { notify } from '../lib/notify'

export const triggerExport = async () => {
  //   try {
  const tasks = await exportWorkspaces()
  if (typeof SLACK_WEBHOOK !== 'undefined') await notify(tasks, 'slack')
  // return new Response('OK', { status: 200 })
  //   } catch (err) {
  //     console.error(err)
  // return new Response('Failed', { status: 500 })
  //   }
}
