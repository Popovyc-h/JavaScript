const createMoney = function (amount, currency) {
  return {
    amount: amount,
    currency: currency,
    [Symbol.toPrimitive](hint) {
      if (hint === 'number' || hint === 'default') {
        return Number(amount)
      } else if (hint === 'string') {
        return `${amount} ${currency}`
      }
    },
  }
}

const createCounter = function (initialValue) {
  return {
    value: initialValue,
    increment() {
      this.value++
      return this
    },
    decrement() {
      this.value--
      return this
    },
    toString() {
      return `Counter ${this.value}`
    },
    valueOf() {
      return Number(this.value)
    },
  }
}

const convertObjectsInArray = function (arr) {
  let result = []

  for (const key in arr) {
    if (arr[key] !== null && typeof arr[key] === 'object' && typeof arr[key].valueOf === 'function') {
      result[key] = arr[key].valueOf()
    } else {
      result[key] = arr[key]
    }
  }
  return result
}

const price = createMoney(100, 'USD')
console.log(+price)
console.log(`${price}`)
console.log(price + 50)

const counter = createCounter(10)
counter.increment().increment().decrement()
console.log(counter.toString())
console.log(counter + 5)

const obj1 = createMoney(50, 'EUR')
const obj2 = createCounter(5)
const result = convertObjectsInArray([10, obj1, 'hello', obj2, null])
console.log(result)
