const inventory = {
  apple: { price: 30, quantity: 100 },
  banana: { price: 25, quantity: 50 },
  orange: { price: 40, quantity: 0 },
  grape: { price: 60, quantity: 30 },
  pear: { price: 35, quantity: 0 },
}

const getProductNames = function (inventory) {
  return Object.keys(inventory)
}

const getTotalValue = function (inventory) {
  return Object.values(inventory).reduce((acc, product) => {
    return acc + product.price * product.quantity
  }, 0)
}

const getAvailableProducts = function (inventory) {
  return Object.fromEntries(Object.entries(inventory).filter(([name, product]) => product.quantity > 0))
}

const convertToMap = function (inventory) {
  return new Map(Object.entries(inventory))
}

const updateInventory = function (map, productName, quantityChange) {
  if (map.has(productName)) {
    const oldValue = map.get(productName)
    const newValue = { ...oldValue, quantity: quantityChange }
    map.set(productName, newValue)
  } else {
    map.set(productName, { price: 0, quantity: quantityChange })
  }
  return map
}

const getLowStockProducts = function (inventory, threshold) {
  return Object.entries(inventory)
    .filter(([name, product]) => product.quantity < threshold)
    .map(([name]) => name)
}

const applyDiscountToAvailable = function (inventory, discountPercent) {
  return Object.fromEntries(
    Object.entries(inventory)
      .filter(([name, product]) => product.quantity > 0)
      .map(([name, product]) => [name, { ...product, price: product.price - product.price * (discountPercent / 100) }]),
  )
}

console.log(getProductNames(inventory))
console.log(getTotalValue(inventory))
console.log(getAvailableProducts(inventory))
const productMap = convertToMap(inventory)
console.log(productMap.get('apple'))
console.log(productMap.has('orange'))
console.log(productMap.size)
const map = convertToMap(inventory)
console.log(map)
console.log(updateInventory(map, 'apple', 200))
console.log(updateInventory(map, 'kiwi', 15))
console.log(getLowStockProducts(inventory, 40))
console.log(applyDiscountToAvailable(inventory, 10))
