function dispatchNotification(channel, payload) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (channel.fail === true) {
        reject(new Error(`[${channel.type}] ${channel.error || 'Збій каналу'}`))
      } else {
        resolve({
          channel: channel.type,
          provider: channel.name,
          deliveredAt: new Date().toISOString(),
          cost: channel.cost,
        })
      }
    }, channel.latency)
  })
}

function withDeadline(promise, timeoutMs, deadlineMsg) {
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(deadlineMsg))
    }, timeoutMs)
  })

  return Promise.race([promise, timeoutPromise])
}

const slowEmail = new Promise((res) => setTimeout(() => res('Email доставлено'), 300))

withDeadline(slowEmail, 150, 'Перевищено дедлайн відправки email')
  .then(console.log)
  .catch((err) => console.warn(err.message))

export { dispatchNotification, withDeadline }
