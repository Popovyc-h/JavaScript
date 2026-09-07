const defaultSettings = {
  theme: 'light',
  language: 'uk',
  notifications: true,
  pagination: { page: 1, limit: 10 },
}

function calculateStats(...args) {
  let min = Math.min(...args)
  let max = Math.max(...args)
  let sum = 0
  let count = args.length

  for (const arg of args) {
    sum += arg
  }

  let avg = +(sum / count).toFixed(2)

  if (count === 0) {
    return null
  } else {
    return {
      min,
      max,
      sum,
      avg,
      count,
    }
  }
}

function mergeConfigurations(defaultConfig, ...customConfig) {
  return customConfig.reduce(
    (acc, custom) => {
      return {
        ...acc,
        ...custom,
      }
    },
    { ...defaultConfig },
  )
}

function createLogEntry(level, message, ...tags) {
  return {
    level,
    message,
    tags: [...new Set(tags)],
    timestamp: new Date().toISOString(),
  }
}

function mergeUniqueArrays(...arrays) {
  return [...new Set(arrays.flat())]
}

function excludeKeys(obj, ...keysToExclude) {
  const safeObj = { ...obj }

  for (const key of keysToExclude) {
    delete safeObj[key]
  }

  return safeObj
}

function insertAt(array, index, ...elements) {
  const firstPart = array.slice(0, index + 1)
  const lastPart = array.slice(index + 1)

  return [...firstPart, ...elements, ...lastPart]
}

function createPipeline(...functions) {
  return function (x) {
    for (const func of functions) {
      x = func(x)
    }
    return x
  }
}

console.log(calculateStats(6, 3, 2))
console.log(calculateStats())

const userConfig1 = { theme: 'dark', notifications: false }
const userConfig2 = { language: 'en', autoSave: true }
console.log(mergeConfigurations(defaultSettings, userConfig1, userConfig2))

const logEntry = createLogEntry('ERROR', 'Помилка з’єднання з БД', 'db', 'network', 'db', 'critical')
console.log(JSON.stringify(logEntry, null, 2))

const arr1 = [1, 2, 3]
const arr2 = [3, 4, 5]
const arr3 = [5, 6, 1]

console.log(mergeUniqueArrays(arr1, arr2, arr3))

const user = { id: 1, name: 'Олексій', email: 'alex@test.com', role: 'admin', token: 'secret123' }

console.log(JSON.stringify(excludeKeys(user, 'token', 'role'), null, 2))

const numbers = [10, 20, 50, 60]
console.log(insertAt(numbers, 2, 30, 40))
console.log(numbers)

const double = (x) => x * 2
const addTen = (x) => x + 10
const stringify = (x) => `Результат: ${x}`

const pipeline = createPipeline(double, addTen, stringify)
console.log(pipeline(5))
