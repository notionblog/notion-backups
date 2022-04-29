/**
 * Return list of available user workspaces
 *
 * @return {Array} arrray of spaces with name and id
 */

const _getSpaces = async () => {
  const res = await fetch('https://www.notion.so/api/v3/getSpaces', {
    method: 'POST',
    headers: {
      Cookie: `token_v2=${TOKEN_V2};`,
      'Content-Type': 'application/json',
    },
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
          exportType: EXPORT_TYPE || 'html',
          timeZone: TIMEZONE || 'Etc/UTC',
          locale: 'en',
        },
      },
    },
  }
  const res = await fetch('https://www.notion.so/api/v3/enqueueTask', {
    method: 'POST',
    body: JSON.stringify(task),
    headers: {
      Cookie: `token_v2=${TOKEN};`,
      'Content-Type': 'application/json',
    },
  })
  const { taskId } = await res.json()
  return taskId
}

/**
 * Check export task status
 *
 * @param {string} taskId id of the task
 * @return {object} status contains informations about the task progress
 */

const _checkExportTask = async taskId => {
  const res = await fetch('https://www.notion.so/api/v3/getTasks', {
    method: 'POST',
    body: JSON.stringify({ taskIds: [taskId] }),
    headers: {
      Cookie: `token_v2=${TOKEN};`,
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()

  return data.results[0].status
}
