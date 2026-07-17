const cart = [
  { id: 1, name: 'Ноутбук', price: 25000, quantity: 1 },
  { id: 2, name: 'Миша', price: 500, quantity: 2 },
  { id: 3, name: 'Клавіатура', price: 1200, quantity: 1 },
]

const addToCart = function (cart, product) {
  let newCart = []
  let found = false

  for (const items of cart) {
    if (items.id === product.id) {
      newCart.push({ id: items.id, name: items.name, price: items.price, quantity: items.quantity + product.quantity })
      found = true
    } else {
      newCart.push(items)
    }
  }

  if (!found) {
    newCart.push(product)
  }

  return newCart
}

const removeFromCart = function (cart, productId) {
  let removeCart = []

  for (const items of cart) {
    if (items.id === productId) {
      continue
    } else {
      removeCart.push(items)
    }
  }

  return removeCart
}

const calculateTotal = function (cart) {
  let totalPrice = 0

  for (const items of cart) {
    totalPrice += items.price * items.quantity
  }

  return Number(totalPrice.toFixed(2))
}

const applyDiscount = function (cart, discountPercent) {
  let result = []

  for (const items of cart) {
    result.push({
      id: items.id,
      name: items.name,
      price: Number(((items.price * (100 - discountPercent)) / 100).toFixed(2)),
      quantity: items.quantity,
    })
  }

  return result
}

const getMostExpensiveProduct = function (cart) {
  let mostExpensive = cart[0]

  for (const items of cart) {
    if (mostExpensive.price < items.price) {
      mostExpensive = items
    }
  }

  return mostExpensive
}

const newCart = addToCart(cart, { id: 2, name: 'Миша', price: 500, quantity: 1 })

const newCart2 = addToCart(cart, {
  id: 4,
  name: 'Монітор',
  price: 999999,
  quantity: 1,
})

const remove = removeFromCart(cart, 2)

console.log(cart)
console.log(newCart)
console.log(newCart2)

console.log(remove)

console.log(calculateTotal(cart))

const discountedCart = applyDiscount(cart, 10)
console.log(discountedCart)

console.log(getMostExpensiveProduct(cart))
