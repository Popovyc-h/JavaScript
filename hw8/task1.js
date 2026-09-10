function createSecureUser(initialData) {
  Object.defineProperty(initialData, 'id', {
    writable: false,
    configurable: false,
    enumerable: true,
  })

  Object.defineProperty(initialData, 'passwordHash', {
    writable: true,
    configurable: true,
    enumerable: false,
  })

  Object.defineProperty(initialData, 'fullName', {
    get() {
      return `${this.firstName} ${this.lastName}`
    },

    set(str) {
      let parts = str.split(' ')

      if (parts.length < 2) {
        throw new Error('Некоректний формат повного імені')
      }

      this.firstName = parts[0]
      this.lastName = parts[1]
    },

    configurable: true,
    enumerable: true,
  })

  return initialData
}

function freezeConfig(config, options = {}) {
  let keys = Object.keys(config)

  for (const key of keys) {
    if (options.allowedToModify.includes(key)) {
      continue
    }

    Object.defineProperty(config, key, {
      writable: false,
      configurable: false,
    })
  }

  Object.preventExtensions(config)

  return config
}

function createBankAccount(accountNumber, initialBalance) {
  let account = {}

  Object.defineProperty(account, 'accountNumber', {
    writable: false,
    configurable: false,
    enumerable: true,
    value: accountNumber,
  })

  Object.defineProperty(account, '_balance', {
    writable: true,
    configurable: true,
    enumerable: false,
    value: initialBalance,
  })

  Object.defineProperty(account, 'balance', {
    get() {
      return `${this._balance} грн`
    },

    set(value) {
      if (value < 0 || typeof value !== 'number') {
        throw new Error('Баланс не може бути від’ємним')
      }
      this._balance = value
    },
  })

  account.deposit = function (amount) {
    if (amount < 0) {
      throw new Error('Сума для поповнення повинна бути додатньою')
    }
    this._balance += amount
  }

  account.withdraw = function (amount) {
    if (this._balance < amount) {
      throw new Error('Недостатньо коштів')
    }

    this._balance -= amount
  }

  return account
}

function createObservableProperty(target, propName, validator) {
  let internalValue

  Object.defineProperty(target, propName, {
    get() {
      return internalValue
    },

    set(newValue) {
      if (!validator(newValue)) {
        console.warn('Некоректне значення для ' + propName + ': ' + newValue)
        return
      }
      internalValue = newValue
    },
  })
}

function cloneWithDescriptors(obj) {
  let newObj = Object.create(Object.getPrototypeOf(obj))
  let descriptors = Object.getOwnPropertyDescriptors(obj)

  Object.defineProperties(newObj, descriptors)

  return newObj
}

const user = createSecureUser({
  id: 1,
  firstName: 'Олександр',
  lastName: 'Коваль',
  email: 'koval@example.com',
  role: 'editor',
  passwordHash: 'e3b0c44298fc1c149afbf4c8996fb924',
})

console.log(user.fullName)
user.fullName = 'Іван Франко'
console.log(user.firstName)

user.id = 999
console.log(user.id)

console.log(Object.keys(user))

const appConfig = {
  apiUrl: 'https://api.example.com/v1',
  port: 3000,
  debug: true,
}

freezeConfig(appConfig, { allowedToModify: ['debug'] })

appConfig.debug = false
console.log(appConfig.debug)

appConfig.port = 8080
appConfig.newProp = 'test'
console.log(appConfig.port)
console.log(appConfig.newProp)

const account = createBankAccount('UA1234567890', 1000)

console.log(account.balance)
account.deposit(500)
console.log(account.balance)

account.withdraw(300)
console.log(account.balance)

const product = { title: 'Ноутбук' }

createObservableProperty(product, 'price', (val) => typeof val === 'number' && val > 0)

product.price = 25000
console.log(product.price)

product.price = -500
console.log(product.price)

const original = {
  _age: 20,
  get age() {
    return this._age
  },
}
Object.defineProperty(original, 'secret', {
  value: 'top-secret',
  writable: false,
  enumerable: false,
})

const copy = cloneWithDescriptors(original)
console.log(copy.age)
console.log(Object.getOwnPropertyDescriptor(copy, 'secret').enumerable)
