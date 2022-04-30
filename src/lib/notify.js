const _exportTime = () => {
  const today = new Date()
  return `${today.getFullYear()}-${today.getMonth() +
    1}-${today.getDate()} -- ${today.getHours()}:${today.getMinutes()}`
}

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
        ? task.value.name + ' workspace' + ' `✅ Success`'
        : task.reason + ' `❌ Failed`',
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
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `💾 Backup: ${_exportTime()}`,
          emoji: true,
        },
      },
      {
        type: 'divider',
      },
      ...tasks.map(task => _slackBlock(task)),
      {
        type: 'divider',
      },
    ],
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
 *  Send Notification via Discord
 *
 * @param {Array} array of export tasks
 */
const _discord = async tasks => {
  const content = {
    username: 'Notion Backups',
    content: `> 💾 **Backup: ${_exportTime()}**`,
    embeds: [
      ...tasks.map(task => ({
        color: 11730954,
        author: {
          name:
            task.status === 'fulfilled'
              ? task.value.name + ' workspace'
              : '❌ Failed: ' + task.reason,
        },
        title: 'Download',
        url:
          task.status === 'fulfilled'
            ? task.value.url
            : 'https://youtu.be/dQw4w9WgXcQ',
      })),
    ],
  }

  await fetch(DISCORD_WEBHOOK, {
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
      case 'discord':
        console.log('sending via discord')
        return await _discord(tasks)
    }
  } catch (err) {
    throw new Error('failed to send notification')
  }
}
