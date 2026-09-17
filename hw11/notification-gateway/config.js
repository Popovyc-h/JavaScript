export const alertChannels = [
  {
    type: 'push',
    name: 'Web Push Gateway',
    latency: 80,
    fail: false,
    cost: 0.01,
  },

  {
    type: 'telegram',
    name: 'Telegram Bot API',
    latency: 130,
    fail: false,
    cost: 0.0,
  },
  {
    type: 'sms',
    name: 'SMS Kyivstar Turbo',
    latency: 220,
    fail: true,
    error: 'SMS Gateway Timeout',
    cost: 0.45,
  },
  {
    type: 'email',
    name: 'Transactional SMTP',
    latency: 190,
    fail: false,
    cost: 0.02,
  },
]

export const notificationPayload = {
  userId: 'usr_8492',
  topic: 'SECURITY_ALERT',
  text: 'Виявлено вхід у ваш акаунт із нового пристрою (Kyiv, Chrome / macOS)',
  urgency: 'high',
}
