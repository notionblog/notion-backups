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
    await logger(msg)
    // Start the export
    const tasks = await exportWorkspaces()
    // Notify the user once the process has been finished
    await notify(tasks)
  } catch (err) {
    console.error(err)
  }
}
