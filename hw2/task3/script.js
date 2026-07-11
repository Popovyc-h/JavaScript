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

const hasCircularReference = function (obj) {}

console.log(deepMerge(defaultPluginConfig, userConfig))
