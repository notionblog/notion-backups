const _slack = async msg => {
  const content = {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: msg,
        },
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

const _discord = async msg => {
  const content = {
    username: 'Logs',
    content: msg,
  }

  await fetch(DISCORD_WEBHOOK, {
    method: 'POST',
    body: JSON.stringify(content),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const logger = async msg => {
  try {
    if (typeof SLACK_WEBHOOK !== 'undefined') await _slack(msg)
    if (typeof DISCORD_WEBHOOK !== 'undefined') await _discord(msg)
  } catch (err) {
    console.error(err)
    throw new Error('failed to send notification')
  }
}
