import { dispatchNotification, withDeadline } from './sender.js'
import { alertChannels, notificationPayload } from './config.js'

async function sendUrgentOtp(channels, payload) {
  const promises = channels.map((channel) => dispatchNotification(channel, payload))

  try {
    return await Promise.any(promises)
  } catch (error) {
    console.error(error.errors)
  }

  return {
    success: false,
    reason: 'Усі канали доставки недоступні',
  }
}

async function broadcastToAll(channels, payload) {
  const promises = channels.map((channel) => dispatchNotification(channel, payload))

  let delivered = []
  let failed = []
  let totalCost = 0

  const result = await Promise.allSettled(promises)

  for (const item of result) {
    if (item.status === 'fulfilled') {
      delivered.push(item.value.channel)
      totalCost += item.value.cost
    } else {
      failed.push({ error: item.reason.message })
    }
  }

  return { delivered, failed, totalCost }
}

async function verifyAllRequiredChannels(channels, payload) {
  const promises = channels.map((channel) => dispatchNotification(channel, payload))

  return await Promise.all(promises)
}

broadcastToAll(alertChannels, notificationPayload).then((report) => {
  console.log('Підсумок розсилки:', {
    успішно: report.delivered,
    помилки: report.failed,
    вартість: `${report.totalCost} грн`,
  })
})
