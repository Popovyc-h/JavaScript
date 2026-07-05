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

const diffProfiles = function (original, update) {}

deepFreeze(profileFromCRM)

profileFromCRM.role = 'guest'
profileFromCRM.preferences.language = 'en'

console.log(profileFromCRM.role)
console.log(profileFromCRM.preferences.language)

const mergeResult = mergeProfiles(profileFromForm, profileFromSocial, profileFromCRM)

console.log(mergeResult)
