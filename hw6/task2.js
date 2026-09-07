const userProfile = {
  id: 101,
  name: 'Марина Коваленко',
  email: 'marina@example.com',
  passwordHash: 'e3b0c44298fc1c149afbf4c8996fb924',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  balance: 1450.5,
  registeredAt: '2026-01-15T08:30:00.000Z',
  lastLogin: '2026-09-01T12:00:00.000Z',
  details: {
    role: 'editor',
    internalNotes: 'VIP-користувач',
    preferences: { theme: 'dark', emailUpdates: true },
  },
}

function serializeWhitelist(obj, allowedProperties) {
  return JSON.stringify(obj, allowedProperties, 2)
}

function serializeMasked(obj, sensitiveKeys, indent = 2) {
  return JSON.stringify(
    obj,
    (key, value) => {
      if (sensitiveKeys.includes(key)) {
        return undefined
      }
      return value
    },
    indent,
  )
}

function safeParseJSON(jsonString, fallbackValue) {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    return fallbackValue
  }
}

function parseWithDates(jsonString, dateFields) {
  return JSON.parse(jsonString, (key, value) => {
    if (dateFields.includes(key)) {
      return new Date(value)
    }
    return value
  })
}

function createCartItem(title, price, quantity, discount = 0) {
  this.title = title
  this.price = price
  this.quantity = quantity
  this.discount = discount
}

createCartItem.prototype.toJSON = function () {
  const finalPrice = +(this.price * (1 - this.discount)).toFixed(2)
  const totalCost = +(finalPrice * this.quantity).toFixed(2)

  return {
    title: this.title,
    finalPrice,
    quantity: this.quantity,
    totalCost,
  }
}

function stringifyWithoutCycles(obj, space = 2) {}

console.log(serializeWhitelist(userProfile, ['id', 'name', 'email', 'balance']))

console.log(serializeMasked(userProfile, ['passwordHash', 'token', 'internalNotes'], 2))

console.log(safeParseJSON('{"valid": true}', {}))
console.log(safeParseJSON('{ invalid json, 123 }', { status: 'error' }))
console.log(safeParseJSON('', []))

const jsonString = JSON.stringify(userProfile)
const parsed = parseWithDates(jsonString, ['registeredAt', 'lastLogin'])

console.log(parsed.registeredAt instanceof Date)
console.log(parsed.registeredAt.getFullYear())
console.log(parsed.name)

const item = new createCartItem('Клавіатура', 2500, 2, 0.1)
console.log(JSON.stringify(item, null, 2))
