const translations = {
  uk: {
    greeting: 'Привіт',
    farewell: 'До побачення',
    menu: {
      home: 'Головна',
      about: 'Про нас',
      contact: 'Контакти',
    },
  },
  en: {
    greeting: 'Hello',
    farewell: 'Goodbye',
    menu: {
      home: 'Home',
      about: 'About',
      contact: 'Contact',
    },
  },
}

const t = function (lang, path) {
  const parts = String(path).split('.')

  let current = translations[lang]

  for (const key of parts) {
    if (current === null || typeof current === 'undefined') {
      return '🔍 [missing translation]'
    }
    current = current[key]
  }

  return current
}

const addTranslation = function (lang, path, value) {
  const parts = String(path).split('.')
  let current = translations[lang]

  for (let i = 0; i < parts.length; i++) {
    if (i === parts.length - 1) {
      current[parts[i]] = value
    } else {
      if (!current[parts[i]]) {
        current[parts[i]] = {}
      }
      current = current[parts[i]]
    }
  }
}

const flattenTranslations = function (lang) {
  const result = {}
  const langObj = translations[lang]

  for (const key in langObj) {
    if (typeof langObj[key] === 'object') {
      for (const subKey in langObj[key]) {
        result[key + '.' + subKey] = langObj[key][subKey]
      }
    } else {
      result[key] = langObj[key]
    }
  }

  return result
}

console.log(t('uk', 'menu.home'))

console.log(t('uk', 'menu.products.title'))
addTranslation('uk', 'menu.products.title', 'Товари')
console.log(t('uk', 'menu.products.title'))

console.log(flattenTranslations('uk'))
