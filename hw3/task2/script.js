const apiResponse = {
  data: {
    user: {
      profile: {
        name: 'Анна',
        contacts: {
          email: 'anna@example.com',
        },
      },
      settings: null,
    },
  },
  meta: {
    timestamp: 1234567890,
  },
}

const userWithMethod = {
  greet() {
    return 'Привіт!'
  },
}

const userWithoutMethod = {}

const original = {
  a: 1,
  b: { c: 2, d: null },
  e: [1, 2, { f: 3 }],
}

const safeGet = function (obj, path, defaultValue) {
  const parts = String(path).split('.')
  let current = obj

  for (const key of parts) {
    if (current === null || current === undefined) {
      return defaultValue
    }
    current = current[key]
  }
  return current
}

const safeCall = function (obj, methodName, ...args) {
  if (typeof obj[methodName] === 'function') {
    return obj[methodName](...args)
  } else {
    return undefined
  }
}

const deepCloneWithOptionalChaining = function (obj) {
  let result = {}

  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      result[key] = obj[key]
    } else if (Array.isArray(obj[key])) {
      let newArr = []

      for (const key2 in obj[key]) {
        if (typeof obj[key][key2] === 'object' && obj[key][key2] !== null) {
          newArr[key2] = deepCloneWithOptionalChaining(obj[key][key2])
        } else {
          newArr[key2] = obj[key][key2]
        }
      }
      result[key] = newArr
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      result[key] = deepCloneWithOptionalChaining(obj[key])
    }
  }
  return result
}

console.log(safeGet(apiResponse, 'data.user.profile.name', 'Unknown'))
console.log(safeGet(apiResponse, 'data.user.settings.theme', 'light'))
console.log(safeGet(apiResponse, 'data.user.address.city', 'Kyiv'))

console.log(safeCall(userWithMethod, 'greet'))
console.log(safeCall(userWithoutMethod, 'greet'))
console.log(safeCall(userWithMethod, 'sayGoodbye'))

const cloned = deepCloneWithOptionalChaining(original)
cloned.b.c = 999
console.log(original.b.c)
