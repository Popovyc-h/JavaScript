// task 1
function compareTo(a, b) {
  if (a < b) return -1
  else if (a > b) return 1
  else if (a === b) return 0
  else return 'invalid parameters'
}

// task 2
function factorial(number) {
  if (number === 0) return 1

  let result = 1

  for (let i = 1; i <= number; i++) {
    result *= i
  }
  return result
}

// task 3
const combineDigits = function (n1, n2, n3) {
  if (isNaN(n1) || isNaN(n2) || isNaN(n3)) {
    return 'Invalid Input'
  }

  return Number(String(n1) + String(n2) + String(n3))
}

// task 4
const area = function (length, height) {
  if (height === undefined || height === null) {
    return length * length
  }
  return length * height
}

// task 5
const isPerfect = function (number) {
  let sum = 0

  for (let i = 1; i < number; i++) {
    if (number % i === 0) {
      sum += i
    }
  }
  if (number === sum) {
    return true
  }
  return false
}

// task 6
const getPerfectNumbersInRange = function (min, max) {
  for (let i = min; i <= max; i++) {
    if (isPerfect(i)) {
      console.log(i)
    }
  }
}

// task 7
const showTime = function (hours, minutes = '00', seconds = '00') {
  console.log(
    `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
  )
}

// task 8
const convertToSecond = function (hours, minutes, seconds) {
  return hours * 3600 + minutes * 60 + seconds
}

// task 9
const convertTime = function (seconds) {
  let hours = Math.trunc(seconds / 3600)
  let minutes = Math.trunc((seconds / 60) % 60)
  let second = seconds % 60

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(second).padStart(2, '0')}`
}

// task 10
const differenceBetweenDates = function (hours1, minutes1, seconds1, hours2, minutes2, seconds2) {
  let totalSeconds1 = convertToSecond(hours1, minutes1, seconds1)
  let totalSeconds2 = convertToSecond(hours2, minutes2, seconds2)

  let differenceInSeconds = Math.abs(totalSeconds1 - totalSeconds2)

  return convertTime(differenceInSeconds)
}

const timeDiff = differenceBetweenDates(1, 30, 10, 2, 30, 15)
console.log(timeDiff)
