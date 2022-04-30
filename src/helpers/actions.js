import { exportWorkspaces } from '../lib/notion'
import { notify } from '../lib/notify'

/*
 *  Export workspaces & send notifications
 *
 */
export const triggerExport = async () => {
  try {
    const tasks = await exportWorkspaces()
    if (typeof SLACK_WEBHOOK !== 'undefined') await notify(tasks, 'slack')
    if (typeof DISCORD_WEBHOOK !== 'undefined') await notify(tasks, 'discord')
  } catch (err) {
    console.error(err)
  }
}
