/*
 *  Convert an export task to a slack message block
 *
 * @param {task} export task
 * @return {object} contains slack block
 */
const _slackBlock = task => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text:
      task.status === 'fulfilled'
        ? '✅ *Success*: ' + task.value.name + ' workspace'
        : '❌ *Failed*:' + task.value.name + ' workspace',
  },
  accessory: {
    type: 'button',
    text: {
      type: 'plain_text',
      text: 'Download',
      emoji: true,
    },
    value: 'download',
    url:
      task.status === 'fulfilled'
        ? task.value.url
        : 'https://youtu.be/dQw4w9WgXcQ',
    action_id: 'button-action',
  },
})
/*
 *  Send Notification via slack
 *
 * @param {Array} array of export tasks
 */
const _slack = async tasks => {
  const content = {
    blocks: tasks.map(task => _slackBlock(task)),
  }
  await fetch(SLACK_WEBHOOK, {
    method: 'POST',
    body: JSON.stringify(content),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

/*
 *  Send Notifications to the users selected channel
 *
 * @param {Array} array of export tasks
 * @param ${string} channel name
 */
export const notify = async (tasks, channel) => {
  try {
    switch (channel) {
      case 'slack':
        return await _slack(tasks)
    }
  } catch (err) {
    throw new Error('failed to send notification')
  }
}
