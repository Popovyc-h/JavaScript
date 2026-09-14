let globalProductIdCounter = 0

class Product {
  #id
  #price
  static taxRate = 0.05

  constructor(title, price, category) {
    this.#id = ++globalProductIdCounter
    this.title = title
    this.#price = price
    this.category = category
  }

  static formatPrice(amount, currency = 'грн') {
    return `${amount} ${currency}`
  }

  calculateTotalWithTax() {
    return this.price * (1 + Product.taxRate)
  }

  getInfo() {
    return `[ID: ${this.#id}] ${this.title} (${this.category} - ${this.#price})`
  }

  get id() {
    return this.#id
  }

  get price() {
    return this.#price
  }

  set price(value) {
    if (value < 0) {
      throw new Error('Ціна повинна бути додатним числом')
    }
    this.#price = value
  }
}

class ElectronicsProduct extends Product {
  constructor(title, price, warrantyMonths, powerConsumption) {
    super(title, price, 'electronics')
    this._warrantyMonths = warrantyMonths
    this.powerConsumption = powerConsumption
  }

  getInfo() {
    return `${super.getInfo()} | Гарантія ${this.warrantyMonths} міс., Потужність: ${this.powerConsumption} Вт`
  }
}

class PerishableProduct extends Product {
  #expirationDate

  constructor(title, price, category, expirationDate) {
    super(title, price, category)
    this.#expirationDate = expirationDate
  }

  isExpired() {
    return this.#expirationDate < new Date()
  }

  getInfo() {
    return `${super.getInfo()} | Придатний до: ${this.#expirationDate.toISOString().split('T')[0]}`
  }
}

class User {
  #passwordHash

  constructor(name, email, role = 'customer') {
    this.name = name
    this.email = email
    this.role = role
  }

  setPassword(newPassword) {
    if (newPassword.length < 6) {
      throw new Error('Пароль повинен скаладатись мінімум з 6 символів')
    }
    this.#passwordHash = `[HASH] ${newPassword}`
  }

  checkPassword(password) {
    return this.#passwordHash === `[HASH] ${password}`
  }

  getRole() {
    return this.role
  }
}

class AdminUser extends User {
  static #secretMasterKey = 'master_admin_2026'

  constructor(name, email, adminKey) {
    if (adminKey !== AdminUser.#secretMasterKey) {
      throw new Error('Відмовлено у доступі: невірний ключ адміністратора')
    } else {
      super(name, email, 'admin')
      this.permissions = ['all']
    }
  }

  static createSuperAdmin(name, email) {
    return new AdminUser(name, email, AdminUser.#secretMasterKey)
  }
}

class ShoppingCart {
  #items = []
  static #totalOrdersCreated = 0

  static get totalOrders() {
    return ShoppingCart.#totalOrdersCreated
  }

  addItem(product, quantity = 1) {
    if (!(product instanceof Product)) {
      throw new Error('Об’єкт не є валідним товаром')
    }

    const existingItem = this.#items.find((item) => item.product === product)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      this.#items.push({ product, quantity })
    }
  }

  removeItem(productId) {
    this.#items = this.#items.filter((item) => item.product.id !== productId)
  }

  get totalCost() {
    return this.#items.reduce((acc, item) => {
      return acc + item.product.price * item.quantity
    }, 0)
  }

  checkout() {
    if (this.#items.length <= 0) {
      throw new Error('Кошик порожній')
    }

    ShoppingCart.#totalOrdersCreated++

    return {
      items: this.#items.map((item) => item.product.title),
      totalCost: this.totalCost,
      date: new Date().toISOString().split('T')[0],
    }
  }
}

function inspectHierarchy(instance) {
  const constructorName = instance.constructor.name
  let inheritanceChain = []
  let current = Object.getPrototypeOf(instance)

  while (current !== null) {
    inheritanceChain.push(current.constructor.name)
    current = Object.getPrototypeOf(current)
  }

  return {
    constructorName,
    inheritanceChain,
    isInstanceOf: function isInstanceOf(ClassRef) {
      return instance instanceof ClassRef
    },
  }
}

const keyboard = new Product('Механічна клавіатура', 3200, 'electronics')

console.log(keyboard.id)
console.log(keyboard.price)
console.log(keyboard.getInfo())
console.log(Product.formatPrice(keyboard.calculateTotalWithTax()))

const tv = new ElectronicsProduct('Smart TV 55"', 18000, 24, 120)
console.log(tv.getInfo())

const milk = new PerishableProduct('Органічне молоко', 45, 'dairy', new Date('2026-10-01'))
console.log(milk.isExpired())
console.log(milk.getInfo())

const user = new User('Bob', 'bob@gmail.com', 'прибиральник')
try {
  user.setPassword('123456')
} catch (error) {
  console.error(error)
}
console.log(user.checkPassword('123456'))
console.log(user.getRole())

const admin = AdminUser.createSuperAdmin('Тарас', 'taras@store.ua')
console.log(admin.getRole())
console.log(admin.permissions)

const cart = new ShoppingCart()
cart.addItem(keyboard, 2)
cart.addItem(tv, 1)

console.log(cart.totalCost)
const orderReport = cart.checkout()
console.log(orderReport)
console.log(ShoppingCart.totalOrders)

const report = inspectHierarchy(tv)
console.log(report.constructorName)
console.log(report.inheritanceChain)
console.log(report.isInstanceOf(Product))
