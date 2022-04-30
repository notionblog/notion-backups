const _BASEURL = 'https://www.notion.so/api/v3'
const _HEADERS = {
  Cookie: `token_v2=${TOKEN_V2};`,
  'Content-Type': 'application/json',
}

/**
 * Return list of available user workspaces
 *
 * @return {Array} arrray of spaces with name and id
 */

const _getSpaces = async () => {
  const res = await fetch(`${_BASEURL}/getSpaces`, {
    method: 'POST',
    headers: _HEADERS,
  })
  const data = await res.json()
  const userSpaces = data[Object.keys(data)[0]].space
  const userSpacesIds = Object.keys(userSpaces)
  return userSpacesIds.map(spaceId => ({
    id: userSpaces[spaceId].value.id,
    name: userSpaces[spaceId].value.name,
  }))
}

/**
 * Setup an export task for a space
 *
 * @param {string} spaceid uuid of the space
 * @return {string} task id
 */

const _setupExportTask = async spaceId => {
  const task = {
    task: {
      eventName: 'exportSpace',
      request: {
        spaceId,
        exportOptions: {
          exportType: typeof EXPORT_TYPE !== 'undefined' ? EXPORT_TYPE : 'html',
          timeZone: typeof TIMEZONE !== 'undefined' ? TIMEZONE : 'Etc/UTC',
          locale: typeof LOCALE !== 'undefined' ? LOCALE : 'en',
        },
      },
    },
  }
  const res = await fetch(`${_BASEURL}/enqueueTask`, {
    method: 'POST',
    body: JSON.stringify(task),
    headers: _HEADERS,
  })

  const { taskId } = await res.json()
  return taskId
}

/**
 * Check the export task status
 *
 * @param {string} taskId id of the task
 * @return {object} status contains informations about the task progress
 */

const _checkExportTask = async taskId => {
  const res = await fetch(`${_BASEURL}/getTasks`, {
    method: 'POST',
    body: JSON.stringify({ taskIds: [taskId] }),
    headers: _HEADERS,
  })
  const data = await res.json()

  return data.results[0].status
}

/**
 *  Check the task status every 5s, then resolve the export data after the process is finished.
 *
 * @param {object} space object contains name and id
 * @return {string} export url
 * @throws {string} error message
 */
const _exportSpace = space => {
  return new Promise(async (resolve, reject) => {
    try {
      const taskId = await _setupExportTask(space.id)

      const check = setInterval(async () => {
        const taskStatus = await _checkExportTask(taskId)
        if (!taskStatus) {
          clearInterval(check)
          reject(new Error(`Failed to export ${space.name} workspace`))
        } else if (taskStatus.type === 'complete') {
          clearInterval(check)
          const data = {
            ...space,
            url: taskStatus.exportURL,
          }
          resolve(data)
        }
      }, 5000)
    } catch (err) {
      console.error(err)
      reject(new Error('Something went wrong'))
    }
  })
}

/**
 * Export all user workspaces
 *
 * @return {Array} arrray of the status and values of all spaces export
 */

export const exportWorkspaces = async () => {
  let spaces = await _getSpaces()
  const tasks = spaces.map(space => _exportSpace(space))
  return Promise.allSettled(tasks)
}
