const profileFromForm = {
  name: 'Іван',
  email: 'ivan@example.com',
  age: 28,
}

const profileFromSocial = {
  name: 'Ivan Petrenko',
  avatar: 'https://example.com/avatar.jpg',
  socialId: '12345',
}

const profileFromCRM = {
  email: 'ivan.petrenko@work.com',
  role: 'admin',
  preferences: {
    language: 'uk',
    notifications: true,
  },
}

const mergeProfiles = function (...profiles) {
  let result = {}

  for (const profile of profiles) {
    result = { ...result, ...profile }
  }
  return result
}

const deepFreeze = function (obj) {
  Object.freeze(obj)

  for (const key in obj) {
    const value = obj[key]

    if (typeof value === 'object' && value != null) {
      deepFreeze(value)
    }
  }
  return obj
}

const diffProfiles = function (original, update) {
  let result = {}

  for (const key in original) {
    if (
      typeof original[key] === 'object' &&
      original[key] !== null &&
      typeof update[key] === 'object' &&
      update[key] !== null
    ) {
      const diff = diffProfiles(original[key], update[key])

      if (Object.keys(diff).length > 0) {
        result[key] = diff
      }
    } else if (original[key] !== update[key]) {
      result[key] = {
        from: original[key],
        to: update[key],
      }
    }
  }

  return result
}

const mergeResult = mergeProfiles(profileFromForm, profileFromSocial, profileFromCRM)

console.log(mergeResult)

deepFreeze(profileFromCRM)

profileFromCRM.role = 'guest'
profileFromCRM.preferences.language = 'en'

console.log(profileFromCRM.role)
console.log(profileFromCRM.preferences.language)

console.log(
  diffProfiles({ name: 'Іван', age: 28, prefs: { lang: 'uk' } }, { name: 'Іван', age: 30, prefs: { lang: 'en' } }),
)
