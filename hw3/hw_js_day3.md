# Домашнє завдання — JS Day 2: Символи, опціональний ланцюжок, перетворення об'єктів

для 12 балів можна зробити 2 завдання із 3рьох.

## Завдання 1. Система кешування з унікальними ключами (Symbol)

У великих проєктах часто потрібно додавати приховані метадані до об'єктів, які не мають конфліктувати з іншими властивостями.

```javascript
const cache = {
    users: {},
    posts: {},
}
```

**Що потрібно зробити:**

1. Створити функцію `createCacheKey(description)`, яка створює і повертає унікальний символ з описом. Кожен виклик має повертати **новий** символ, навіть якщо опис однаковий.

```javascript
const key1 = createCacheKey('user')
const key2 = createCacheKey('user')
console.log(key1 === key2) // false
```

2. Створити функцію `getGlobalCacheKey(name)`, яка повертає глобальний символ з реєстру за допомогою `Symbol.for()`. Якщо символ з таким ім'ям вже існує — повертає існуючий, якщо ні — створює новий.

```javascript
const globalKey1 = getGlobalCacheKey('api_cache')
const globalKey2 = getGlobalCacheKey('api_cache')
console.log(globalKey1 === globalKey2) // true
```

3. Створити функцію `attachMetadata(obj, key, value)`, яка приймає об'єкт, символьний ключ і значення, і додає до об'єкта приховану властивість з цим ключем. Функція має повертати той самий об'єкт (для chaining).

```javascript
const user = { name: 'Олег', age: 25 }
const metaKey = createCacheKey('lastAccessed')
attachMetadata(user, metaKey, Date.now())
// user[metaKey] тепер містить timestamp
```

4. Створити функцію `getMetadata(obj, key)`, яка повертає значення метадати за символьним ключем, або `undefined`, якщо такої властивості немає.

5. Створити функцію `hasSymbolProperties(obj)`, яка перевіряє, чи є в об'єкті хоча б одна властивість з символьним ключем. Повертає `true` або `false`.

> **Підказка:** використовуйте `Object.getOwnPropertySymbols(obj)` для отримання всіх символьних властивостей.

---

## Завдання 2. Безпечна навігація в API відповідях (Optional Chaining)

При роботі з API часто приходять складні вкладені об'єкти, де деякі поля можуть бути відсутніми.

```javascript
const apiResponse = {
    data: {
        user: {
            profile: {
                name: 'Анна',
                contacts: {
                    email: 'anna@example.com',
                },
            },
            settings: null,
        },
    },
    meta: {
        timestamp: 1234567890,
    },
}
```

**Що потрібно зробити:**

1. Створити функцію `safeGet(obj, path, defaultValue)`, яка приймає об'єкт, шлях до властивості через крапку (напр. `"data.user.profile.name"`), і значення за замовчуванням. Функція має:
   - Безпечно пройти по шляху, використовуючи логіку опціонального ланцюжка.
   - Якщо на будь-якому рівні значення `null` або `undefined` — повернути `defaultValue`.
   - Якщо властивість існує — повернути її значення.

```javascript
safeGet(apiResponse, 'data.user.profile.name', 'Unknown') // "Анна"
safeGet(apiResponse, 'data.user.settings.theme', 'light') // "light"
safeGet(apiResponse, 'data.user.address.city', 'Kyiv') // "Kyiv"
```

> **Підказка:** розбийте шлях через `split(".")` і пройдіться циклом по частинах. На кожному кроці перевіряйте, чи не є поточне значення `null` або `undefined`.

2. Створити функцію `safeCall(obj, methodName, ...args)`, яка безпечно викликає метод об'єкта, якщо він існує і є функцією. Якщо метод не існує або не є функцією — повертає `undefined`.

```javascript
const userWithMethod = {
    greet() {
        return 'Привіт!'
    },
}

const userWithoutMethod = {}

safeCall(userWithMethod, 'greet') // "Привіт!"
safeCall(userWithoutMethod, 'greet') // undefined
safeCall(userWithMethod, 'sayGoodbye') // undefined
```

3. Створити функцію `deepCloneWithOptionalChaining(obj)`, яка створює глибоку копію об'єкта. При цьому:
   - Якщо значення властивості — `null` або `undefined`, воно копіюється як є.
   - Якщо значення — об'єкт (але не `null`), функція викликається рекурсивно.
   - Масиви теж мають копіюватися рекурсивно (просто створіть новий масив і пройдіться циклом).

```javascript
const original = {
    a: 1,
    b: { c: 2, d: null },
    e: [1, 2, { f: 3 }],
}

const cloned = deepCloneWithOptionalChaining(original)
cloned.b.c = 999
console.log(original.b.c) // 2 (оригінал не змінився)
```

---

## Завдання 3. Перетворення об'єктів для обчислень (Symbol.toPrimitive)

Іноді потрібно, щоб кастомні об'єкти могли брати участь у математичних операціях або перетворюватись у рядки для виводу.

```javascript
const price = {
    amount: 100,
    currency: 'USD',
}
```

**Що потрібно зробити:**

1. Створити функцію `createMoney(amount, currency)`, яка повертає об'єкт з властивостями `amount` і `currency`, і додає до нього метод `[Symbol.toPrimitive](hint)`:
   - Якщо `hint` дорівнює `"number"` — повертає числове значення `amount`.
   - Якщо `hint` дорівнює `"string"` — повертає рядок у форматі `"amount currency"` (напр. `"100 USD"`).
   - Якщо `hint` дорівнює `"default"` — повертає числове значення `amount`.

```javascript
const price = createMoney(100, 'USD')
console.log(+price) // 100
console.log(`${price}`) // "100 USD"
console.log(price + 50) // 150
```

2. Створити функцію `createCounter(initialValue)`, яка повертає об'єкт-лічильник з властивістю `value` і методами:
   - `increment()` — збільшує значення на 1 і повертає об'єкт (для chaining).
   - `decrement()` — зменшує значення на 1 і повертає об'єкт.
   - `toString()` — повертає рядок у форматі `"Counter: value"`.
   - `valueOf()` — повертає поточне числове значення.

```javascript
const counter = createCounter(10)
counter.increment().increment().decrement()
console.log(counter.toString()) // "Counter: 11"
console.log(counter + 5) // 16
```

3. Створити функцію `convertObjectsInArray(arr)`, яка приймає масив, де можуть бути числа, рядки та об'єкти з методом `valueOf()`. Функція має:
   - Пройтись по масиву циклом `for`.
   - Для кожного елемента, якщо це об'єкт (не `null`) і у нього є метод `valueOf`, який є функцією — викликати `valueOf()` і замінити елемент на результат.
   - Інші елементи залишити без змін.
   - Повернути **новий** масив з перетвореними значеннями.

```javascript
const obj1 = createMoney(50, 'EUR')
const obj2 = createCounter(5)
const result = convertObjectsInArray([10, obj1, 'hello', obj2, null])
// [10, 50, "hello", 5, null]
```

---

## Додаткові вимоги

1. Усі функції мають бути **чистими** (не модифікувати вхідні дані), крім `attachMetadata` та методів об'єктів (які свідомо змінюють стан).
2. Не використовувати методи масивів (`map`, `reduce`, `filter`, `forEach`) — тільки цикли `for`, `for..in`.
3. Коментувати код не потрібно, але назви змінних мають бути змістовними.
4. Тестувати кожну функцію хоча б на 2-3 прикладах (можна просто викликати в кінці файлу і виводити результат у консоль).
