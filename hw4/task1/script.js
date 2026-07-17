const normalizeUsername = function (username) {
  let name = String(username)

  name = name.toLowerCase().trim()

  if (name.length < 3 || name.length > 20) {
    return null
  }

  for (let i = 0; i < name.length; i++) {
    if (
      !(name.charCodeAt(i) >= 97 && name.charCodeAt(i) <= 122) &&
      !(name.charCodeAt(i) >= 48 && name.charCodeAt(i) <= 57)
    ) {
      return null
    }
  }

  return name
}

const normalizeEmail = function (email) {
  let validEmail = String(email)
  validEmail = validEmail.toLowerCase().trim()
  let atIndex = validEmail.indexOf('@')

  if (atIndex === -1 || validEmail.indexOf('.', atIndex) === -1) {
    return null
  }

  return validEmail
}

const formatPhoneNumber = function (phone) {
  let strPhone = String(phone)
  let onlyDigits = ''

  for (let i = 0; i < strPhone.length; i++) {
    if (strPhone.charCodeAt(i) >= 48 && strPhone.charCodeAt(i) <= 57) {
      onlyDigits += strPhone[i]
    }
  }

  if (onlyDigits.startsWith('380')) {
    onlyDigits = '+' + onlyDigits
  }

  if (onlyDigits.startsWith('0')) {
    onlyDigits = '+38' + onlyDigits
  }

  if (onlyDigits.length !== 13) {
    return null
  }

  return onlyDigits
}

const capitalizeFullName = function (fullName) {
  let words = []
  let currentWord = ''
  let result = ''

  for (const char of fullName) {
    if (char === ' ') {
      if (currentWord.length > 0) {
        words.push(currentWord)
        currentWord = ''
      }
    } else {
      currentWord += char
    }
  }

  if (currentWord.length > 0) {
    words.push(currentWord)
  }

  for (let word of words) {
    let capitalized = word.at(0).toUpperCase() + word.slice(1).toLowerCase()

    if (result !== '') {
      result += ' '
    }

    result += capitalized
  }

  return result
}

console.log(normalizeUsername(' UserName123  '))
console.log(normalizeUsername('ab'))
console.log(normalizeUsername('user@name'))

console.log(`\n${normalizeEmail('  USER@EXAMPLE.COM  ')}`)
console.log(normalizeEmail('notanemail'))
console.log(normalizeEmail('test@'))

console.log(`\n${formatPhoneNumber('+380 (50) 123-45-67')}`)
console.log(formatPhoneNumber('0501234567'))
console.log(formatPhoneNumber('501234567'))

console.log(capitalizeFullName('іван  петрович   сидоренко'))
console.log(capitalizeFullName('  марія    '))
