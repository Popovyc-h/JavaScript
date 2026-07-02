// Task 1

const defaultTheme = {
  primaryColor: '#007bff',
  secondaryColor: '#6c757d',
  fontSize: 16,
  borderRadius: 4,
}

const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
  },
  spacing: { unit: 8 },
}

const overrides = {
  fontSize: 20,
}

// Task 1

const createTheme = function (overrides) {
  const newObj = {}

  let keys = Object.keys(defaultTheme)

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]

    if (Object.hasOwn(overrides, key)) {
      newObj[key] = overrides[key]
    } else {
      newObj[key] = defaultTheme[key]
    }
  }

  return newObj
}

// Task 2

const getCssVars = function (theme) {
  const result = {}

  for (const key in theme) {
    let newKey = ''

    for (const char of key) {
      if (char === char.toUpperCase()) {
        newKey += '-' + char.toLowerCase()
        continue
      }
      newKey += char
    }

    result['--' + newKey] = theme[key]
  }

  return result
}

// Task 3

const updateTheme = function (theme, path, value) {
  const parts = String(path).split('.')
  let current = theme

  for (let i = 0; i < parts.length - 1; i++) {
    current = current[parts[i]]
  }

  const lastKey = parts[parts.length - 1]
  current[lastKey] = value
}
