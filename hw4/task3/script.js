const generatePIN = function (length) {
  let pin = ''

  for (let i = 0; i < length; i++) {
    let digit = Math.floor(Math.random() * 10)
    pin += digit
  }

  return pin
}

const generatePassword = function (length, includeNumbers, includeSymbols) {
  let password = ''
  let charset = 'abcdefghijklmnopqrstuvwxyz'

  if (includeNumbers) {
    charset += '0123456789'
  }

  if (includeSymbols) {
    charset += '!@#$%^&*'
  }

  for (let i = 0; i < length; i++) {
    let index = Math.floor(Math.random() * charset.length)
    password += charset[index]
  }

  return password
}

const validatePIN = function (pin) {
  let strPin = String(pin)

  for (let i = 0; i < strPin.length; i++) {
    if (!(strPin.charCodeAt(i) >= 48 && strPin.charCodeAt(i) <= 57)) {
      return false
    }
  }

  if (pin.length === 4 || pin.length === 6) {
    return true
  }

  return false
}

const generateSecureCode = function (prefix) {
  return prefix + '-' + generatePIN(4) + '-' + generatePIN(4) + '-' + generatePIN(4)
}

const calculatePasswordStrength = function (password) {
  let power = 0
  let strPass = String(password)

  for (let i = 0; i < password.length; i++) {
    if (
      (strPass.charCodeAt(i) >= 65 && strPass.charCodeAt(i) <= 90) ||
      (strPass.charCodeAt(i) >= 97 && strPass.charCodeAt(i) <= 122)
    ) {
      power += 2
    }
    if (strPass.charCodeAt(i) >= 48 && strPass.charCodeAt(i) <= 57) {
      power += 3
    }
    if ('!@#$%^&*'.indexOf(strPass[i]) !== -1) {
      power += 5
    }
  }

  if (strPass.length >= 12) {
    power += 20
  }

  if (power > 100) {
    return 100
  }

  return power
}

console.log(generatePIN(4))
console.log(generatePIN(6))

console.log(generatePassword(8, true, false))
console.log(generatePassword(10, true, true))

console.log(validatePIN('1234'))
console.log(validatePIN('123456'))
console.log(validatePIN('12345'))
console.log(validatePIN('123d4'))

console.log(generateSecureCode('PROMO'))
console.log(generateSecureCode('GIFT'))

console.log(calculatePasswordStrength('password'))
console.log(calculatePasswordStrength('pass123'))
console.log(calculatePasswordStrength('P@ss123!Long'))
