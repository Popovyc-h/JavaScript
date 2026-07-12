const defaultPluginConfig = {
  output: {
    filename: 'bundle.js',
    path: '/dist',
    sourceMap: false,
  },
  rules: {
    js: { enabled: true, loader: 'babel' },
    css: { enabled: false, loader: 'css' },
  },
  plugins: [],
  mode: 'development',
}

const userConfig = {
  output: {
    sourceMap: true,
  },
  rules: {
    css: {
      enabled: true,
    },
  },
  mode: 'production',
}

const cyclicObj = {
  title: 'Loop',
}

cyclicObj.self = cyclicObj

const deepMerge = function (target, source) {
  let result = { ...target }

  let sourceKeys = Object.keys(source)

  for (const key of sourceKeys) {
    if (
      typeof target[key] === 'object' &&
      target[key] !== null &&
      typeof source[key] === 'object' &&
      source[key] !== null
    ) {
      result[key] = deepMerge(target[key], source[key])
    } else {
      result[key] = source[key]
    }
  }

  return result
}

const hasCircularReference = function (obj, seen = []) {
  if (obj === null || typeof obj !== 'object') {
    return false
  }

  if (seen.includes(obj)) {
    return true
  }

  seen.push(obj)

  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      if (hasCircularReference(obj[key], seen)) {
        return true
      }
    }
  }
  return false
}

const pick = function (obj, keys) {
  let result = {}

  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key]
    }
  }

  return result
}

console.log(deepMerge(defaultPluginConfig, userConfig))
console.log(`defaultPluginConfig: ${hasCircularReference(defaultPluginConfig)}`)
console.log(`cyclicObj: ${hasCircularReference(cyclicObj)}`)
console.log(pick({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'c']))
