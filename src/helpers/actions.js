import { exportWorkspaces } from '../lib/notion'
import { notify } from '../lib/notify'
import { logger } from '../lib/logger'

/*
 *  Export workspaces & send notifications
 *
 */
export const triggerExport = async () => {
  try {
    // Notify the user that process has started
    const msg = `📡 *log*: starting the backup process\n`
    if (typeof SLACK_WEBHOOK !== 'undefined') await logger(msg, 'slack')
    if (typeof DISCORD_WEBHOOK !== 'undefined') await logger(msg, 'discord')
    // Start the export
    const tasks = await exportWorkspaces()
    // Notify the user once the process has been finished
    if (typeof SLACK_WEBHOOK !== 'undefined') await notify(tasks, 'slack')
    if (typeof DISCORD_WEBHOOK !== 'undefined') await notify(tasks, 'discord')
  } catch (err) {
    console.error(err)
  }
}
