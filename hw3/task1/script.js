const cache = {
  users: {},
  posts: {},
}

const createCacheKey = function (description) {
  return Symbol(description)
}

const getGlobalCacheKey = function (name) {
  return Symbol.for(name)
}

const attachMetadata = function (obj, key, value) {
  obj[key] = value
  return obj
}

const getMetadata = function (obj, key) {
  return obj[key]
}

const hasSymbolProperties = function (obj) {
  if (Object.getOwnPropertySymbols(obj).length !== 0) {
    return true
  }
  return false
}

const key1 = createCacheKey('user')
const key2 = createCacheKey('user')
console.log(key1 === key2)

const globalKey1 = getGlobalCacheKey('api_cache')
const globalKey2 = getGlobalCacheKey('api_cache')
console.log(globalKey1 === globalKey2)

const user = { name: 'Олег', age: 25 }
const metaKey = createCacheKey('lastAccessed')
attachMetadata(user, metaKey, Date.now())
console.log(user)
