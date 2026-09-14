# Домашнє завдання — JS Day 9: Обробка помилок (try...catch, власні класи помилок), Асинхронність: Колбеки, Проміси та Ланцюжки промісів (Promise Chaining, Error Handling)

для 12 балів обов'язково зробити лише 1 завдання із 2-х на ваш вибір (інше за бажанням для додаткової практики).

---

## Завдання 1. Архітектура надійної обробки помилок та асинхронна еволюція: від Callbacks до Promises (Custom Errors, try...catch...finally, Error-first Callbacks, Promisification)

При побудові сучасних бекенд- та фронтенд-систем критично важливо гарантувати стійкість до збоїв: коректно класифікувати помилки, перехоплювати їх на відповідних рівнях абстракції, очищати ресурси та вміти переводити застарілий асинхронний код на базі колбеків у надійні, керовані проміси (Promises).

```javascript
// Початковий приклад вхідних сирих даних від зовнішнього сервісу
const sampleUserData = {
    id: 101,
    name: 'Марина Ковальчук',
    email: 'marina@tech.ua',
    age: 26,
    role: 'manager',
    settings: '{"theme":"dark","notifications":true}',
}
```

**Що потрібно зробити:**

1. Створити ієрархію кастомних класів помилок, які розширюють вбудований клас `Error`:
   - Базовий клас `AppError extends Error`:
     - Приймає `(message, statusCode = 500)`.
     - Викликає `super(message)`.
     - Автоматично встановлює властивість `this.name = this.constructor.name`.
     - Зберігає `this.statusCode = statusCode`.
     - Зберігає часову мітку `this.timestamp = new Date()`.
   - Клас `ValidationError extends AppError`:
     - Конструктор приймає `(message, field = null)`.
     - Викликає `super(message, 400)`.
     - Зберігає поле `this.field = field`.
   - Клас `PropertyRequiredError extends ValidationError`:
     - Конструктор приймає тільки назву пропущеного поля `property`.
     - Формує повідомлення виду: `"Відсутня обов'язкова властивість: <property>"`.
     - Викликає `super(message, property)`.
   - Клас `DatabaseError extends AppError`:
     - Конструктор приймає `(message, originalError = null)`.
     - Викликає `super(message, 503)`.
     - Зберігає посилання на початкову причину `this.cause = originalError`.

```javascript
const err1 = new PropertyRequiredError('email')
console.log(err1.name) // "PropertyRequiredError"
console.log(err1.message) // "Відсутня обов'язкова властивість: email"
console.log(err1.field) // "email"
console.log(err1.statusCode) // 400
console.log(err1 instanceof ValidationError) // true
console.log(err1 instanceof AppError) // true
console.log(err1 instanceof Error) // true
```

2. Створити модуль безпечного парсингу та валідації користувача з використанням `try...catch...finally` та повторним викиданням помилок (Rethrowing):
   - Реалізувати функцію `parseAndValidateUser(jsonString)`:
     - У блоці `try`:
       - Виконує `JSON.parse(jsonString)`. Якщо формат не валідний, викидає `ValidationError('Невалідний JSON-формат')`.
       - Перевіряє наявність обов'язкових полів: `name`, `email`, `age`. Якщо якесь поле відсутнє — викидати `new PropertyRequiredError('<назва_поля>')`.
       - Перевіряє, що `age` є числом `>= 18`. Якщо менше — викидати `new ValidationError('Вік повинен бути не менше 18 років', 'age')`.
       - Якщо в об'єкті є рядок `settings`, пробує його розпарсити через `JSON.parse`.
       - Повертає готовий нормалізований об'єкт користувача.
     - У блоці `catch (error)`:
       - Якщо `error instanceof ValidationError` — формує та повертає структурований звіт про помилку клієнта: `{ success: false, error: error.name, field: error.field, message: error.message, status: error.statusCode }`.
       - Якщо помилка **невідома** (наприклад, системний `TypeError` чи `ReferenceError`) — **повторно викидає її (`throw error`)**, не приховуючи критичний збій програми!
     - У блоці `finally`:
       - Фіксує час завершення валідації або виводить у консоль відмітку аудиту: `[Audit] Спроба валідації завершена`.

```javascript
const validJson = JSON.stringify({ name: 'Олексій', email: 'alex@work.ua', age: 24 })
console.log(parseAndValidateUser(validJson))
// { name: 'Олексій', email: 'alex@work.ua', age: 24, ... }

const missingFieldJson = JSON.stringify({ name: 'Анна', age: 20 })
console.log(parseAndValidateUser(missingFieldJson))
// { success: false, error: 'PropertyRequiredError', field: 'email', message: '...', status: 400 }

const underageJson = JSON.stringify({ name: 'Іван', email: 'ivan@test.ua', age: 16 })
console.log(parseAndValidateUser(underageJson))
// { success: false, error: 'ValidationError', field: 'age', message: '...', status: 400 }
```

3. Реалізувати асинхронні операції на базі класичного патерну Error-First Callbacks (`callback(err, result)`):
   - Створити три асинхронні сервісні функції з таймерами `setTimeout`:
     - `fetchUserFromDB(userId, callback)`: імітує пошук у базі даних (затримка 200 мс). Якщо `userId <= 0` або не знайдено — викликає `callback(new DatabaseError('Користувача не знайдено'))`, інакше `callback(null, { id: userId, name: 'Ольга', role: 'editor' })`.
     - `fetchUserPermissions(role, callback)`: імітує отримання прав доступу (затримка 150 мс). Якщо `role === 'guest'` — `callback(null, ['read'])`, для `'editor'` — `callback(null, ['read', 'write', 'publish'])`, інакше помилка `callback(new AppError('Невідома роль', 403))`.
     - `logUserAccess(userId, action, callback)`: імітує запис у журнал аудиту (затримка 100 мс). Повертає `callback(null, { logged: true, timestamp: Date.now() })`.
   - Продемонструвати виконання повного ланцюжка через вкладені колбеки ("Callback Hell" / "Піраміда загибелі"): знайти користувача -> отримати його права -> залогувати доступ, забезпечивши перевірку `if (err)` на кожному рівні вкладеності.

```javascript
fetchUserFromDB(101, (err, user) => {
    if (err) {
        console.error('Помилка користувача:', err.message)
        return
    }
    fetchUserPermissions(user.role, (err, permissions) => {
        if (err) {
            console.error('Помилка прав:', err.message)
            return
        }
        logUserAccess(user.id, 'login', (err, logResult) => {
            if (err) {
                console.error('Помилка логування:', err.message)
                return
            }
            console.log('Успішний вхід через колбеки:', { user, permissions, logResult })
        })
    })
})
```

4. Створити універсальну функцію промісифікації `promisify(fn)`:
   - Приймає асинхронну функцію `fn`, яка очікує останнім аргументом колбек стандарту `(err, result)`.
   - Повертає нову функцію-обгортку, яка приймає ті самі параметри, але повертає `Promise`:
     - Якщо функція викликає колбек із першим аргументом `err` (помилка є) — переводить проміс у стан *rejected* через `reject(err)`.
     - Якщо помилки немає (`!err`) — переводить проміс у стан *fulfilled* через `resolve(result)`.
   - За допомогою `promisify` створити промісифіковані версії функцій із пункту 3:
     - `fetchUserFromDBPromise = promisify(fetchUserFromDB)`
     - `fetchUserPermissionsPromise = promisify(fetchUserPermissions)`
     - `logUserAccessPromise = promisify(logUserAccess)`

```javascript
const promisify = (fn) => {
    // Ваша реалізація
}

const fetchUserFromDBPromise = promisify(fetchUserFromDB)
fetchUserFromDBPromise(101)
    .then(user => console.log('Отримано користувача через Promise:', user.name))
    .catch(err => console.error('Помилка:', err.message))
```

5. Побудувати лінійний плоский ланцюжок викликів на базі створених промісів із повноцінною обробкою результату та життєвим циклом:
   - Викликати `fetchUserFromDBPromise(101)`.
   - У першому `.then(user)`: зберегти користувача, повернути виклик `fetchUserPermissionsPromise(user.role)`.
   - У другому `.then(permissions)`: зберегти права, повернути виклик `logUserAccessPromise(sessionData.user.id, 'dashboard_view')`.
   - У третьому `.then(logResult)`: сформувати та вивести фінальний підсумковий об'єкт сесії.
   - Обробити помилки в єдиному термінальному блоці `.catch(error)`: вивести тип помилки (`error.name`), статус (`error.statusCode`) та повідомлення.
   - Додати термінальний блок `.finally()`: гарантовано вивести повідомлення про звільнення підключення до бази/завершення операції незалежно від успіху чи помилки.

```javascript
// Демонстрація відсутності піраміди вкладеності (плаский ланцюжок)
let sessionData = {}

fetchUserFromDBPromise(101)
    .then(user => {
        sessionData.user = user
        return fetchUserPermissionsPromise(user.role)
    })
    .then(permissions => {
        sessionData.permissions = permissions
        return logUserAccessPromise(sessionData.user.id, 'dashboard_view')
    })
    .then(logResult => {
        sessionData.log = logResult
        console.log('Повна сесія зібрана успішно:', sessionData)
    })
    .catch(error => {
        console.error(`[${error.name} | Status: ${error.statusCode || 500}]: ${error.message}`)
    })
    .finally(() => {
        console.log('Сесійний пайплайн завершив роботу. Ресурси звільнено.')
    })
```

---

## Завдання 2. Асинхронний конвеєр обробки даних: Ланцюжки промісів, Thenable-об'єкти та надійна обробка помилок (Promise Chaining, Thenables, Error Recovery & Retry Strategy)

В сучасних розподілених системах обробка одного запиту складається з послідовності асинхронних трансформацій: отримання даних, перевірка бізнес-правил, звернення до сторонніх API та збереження результатів. Якщо один із кроків завершується помилкою, система повинна вміти відновитися (Fallback), повторити спробу (Retry) або коректно передати помилку далі по ланцюжку (Rethrowing).

```javascript
// Базовий стан конвеєра замовлення
const newOrderRequest = {
    orderId: 'ORD-5542',
    clientType: 'VIP',
    items: [
        { id: 10, title: 'Монітор 27"', price: 9500, inStock: true },
        { id: 14, title: 'Кронштейн для монітора', price: 1800, inStock: true },
    ],
    currency: 'UAH',
}
```

**Що потрібно зробити:**

1. Створити клас кастомної помилки `NetworkServiceError extends Error` та генератор імітованих асинхронних запитів:
   - Клас `NetworkServiceError`:
     - Приймає `(message, endpoint, retryable = true)`.
     - Зберігає властивості `this.endpoint`, `this.retryable` та `this.name = 'NetworkServiceError'`.
   - Функція `mockApiRequest(endpoint, delayMs, shouldFail = false, payload = null)`:
     - Повертає новий `new Promise((resolve, reject) => { ... })`.
     - Використовує `setTimeout` із затримкою `delayMs`.
     - Якщо `shouldFail === true` — викликає `reject(new NetworkServiceError('Помилка запиту до ' + endpoint, endpoint, true))`.
     - Якщо `shouldFail === false` — викликає `resolve(payload)`.

```javascript
const testSuccess = mockApiRequest('/api/inventory', 100, false, { available: true })
testSuccess.then(res => console.log('Склад:', res))

const testFailure = mockApiRequest('/api/payment-gateway', 100, true)
testFailure.catch(err => {
    console.log(err.name) // "NetworkServiceError"
    console.log(err.endpoint) // "/api/payment-gateway"
    console.log(err.retryable) // true
})
```

2. Створити клас-Thenable `PriceCalculatorTask` (інтеграція з Duck Typing у промісах):
   - У стандарті Promises/A+ будь-який об'єкт із методом `.then(resolve, reject)` вважається "Thenable" і може безпосередньо вбудовуватися в нативні ланцюжки промісів без обгортання в `new Promise`.
   - Клас `PriceCalculatorTask`:
     - Приймає в конструкторі `(items, discountRate = 0)`.
     - Реалізує метод `then(resolve, reject)`:
       - Перевіряє вхідний масив `items`. Якщо масив порожній або не є масивом — викликає `reject(new Error('Список товарів порожній'))`.
       - Через невелику асинхронну паузу (`setTimeout` 100 мс) підраховує базову вартість: суму цін усіх товарів.
       - Розраховує фінальну суму з урахуванням знижки: `subtotal * (1 - discountRate)`.
       - Викликає `resolve({ subtotal, discountRate, total })`.

```javascript
const calculator = new PriceCalculatorTask([
    { title: 'Ноутбук', price: 30000 },
    { title: 'Миша', price: 1000 },
], 0.1)

// Вбудовування Thenable-об'єкта напряму в нативний Promise:
Promise.resolve()
    .then(() => calculator)
    .then(calculation => {
        console.log('Розрахунок завершено:', calculation)
        // { subtotal: 31000, discountRate: 0.1, total: 27900 }
    })
```

3. Побудувати багатоетапний конвеєр обробки замовлення з передачею та трансформацією даних між `.then()`:
   - Створити функцію `processOrderPipeline(orderRequest)`:
     - **Крок 1**: Перевірка наявності товарів на складі через `mockApiRequest('/api/inventory/check', 150, false, { inStock: true })`. Повертає оновлений об'єкт замовлення зі статусом перевірки складу.
     - **Крок 2**: Отримання персональної знижки клієнта через `mockApiRequest('/api/loyalty', 100, false, { discount: orderRequest.clientType === 'VIP' ? 0.15 : 0.05 })`.
     - **Крок 3**: Розрахунок цін за допомогою повернення екземпляра Thenable-класу `new PriceCalculatorTask(order.items, loyalty.discount)`.
     - **Крок 4**: Реєстрація транзакції через `mockApiRequest('/api/orders/commit', 120, false, { success: true, transactionId: 'TX-90412' })`.
     - Кожен крок повинен повертати або результат, або новий Promise/Thenable, демонструючи чітке послідовне виконання без вкладеності.

```javascript
processOrderPipeline(newOrderRequest)
    .then(finalResult => {
        console.log('Замовлення успішно оброблено:', finalResult)
    })
    .catch(err => {
        console.error('Збій у конвеєрі:', err.message)
    })
```

4. Реалізувати механізм гранульованого перехоплення помилок, стратегію відновлення (Fallback) та повторного викидання (Rethrowing):
   - У середині ланцюжка промісів додати необов'язковий запит на отримання безкоштовного подарункового промокоду: `mockApiRequest('/api/bonus-service', 100, true)`. Цей сервіс нестабільний і падає з помилкою.
   - **Локальне відновлення (Fallback / Recovery)**:
     - Перехопити цю помилку локальним `.catch(err)` безпосередньо після кроку отримання бонусу.
     - Залогувати попередження: `[Попередження] Не вдалося отримати бонуси, застосовано дефолтний подарунок`.
     - Повернути резервне значення (наприклад `{ promoCode: 'WELCOME_BONUS' }`), що дозволяє всьому основному ланцюжку продовжити виконання (стан промісу повертається у fulfilled!).
   - **Повторне викидання (Rethrowing)**:
     - Якщо ж помилка трапляється на критичному кроці (наприклад, `mockApiRequest('/api/payment', ...)`), перехопити її, перевірити тип: якщо це критична фінансова помилка — зробити `throw err`, щоб передати відхилення у фінальний централізований `.catch()`.

```javascript
function checkoutWithBonusRecovery(orderRequest) {
    return mockApiRequest('/api/payment', 100, false, { paid: true })
        .then(paymentResult => {
            console.log('Оплата успішна:', paymentResult)
            // Нестабільний запит за бонусом:
            return mockApiRequest('/api/bonus-service', 100, true)
                .catch(bonusError => {
                    // Відновлення після помилки (Fallback): повертаємо резервний бонус
                    console.warn(`[Fallback]: Бонус-сервіс тимчасово недоступний (${bonusError.message}). Видано стандартний бонус.`)
                    return { bonusCode: 'STANDARD_FALLBACK_2026' }
                })
        })
        .then(bonusInfo => {
            console.log('Фінальні бонуси користувача:', bonusInfo)
            return { status: 'completed', bonus: bonusInfo }
        })
        .catch(fatalError => {
            // Сюди потраплять лише критичні помилки оплати
            console.error('Критичний збій оформлення:', fatalError.message)
            throw fatalError
        })
}
```

5. Створити функцію автоматичних повторних спроб (Retry Strategy) на базі чистих промісів `retryOperation(operationFn, maxRetries = 3, delayMs = 300)`:
   - Приймає функцію `operationFn`, яка при кожному виклику повертає `Promise`.
   - Якщо операція успішна — негайно повертає її результат через `resolve`.
   - Якщо операція реджектиться:
     - Якщо спроби ще є (`retriesLeft > 0`): виводить у консоль повідомлення про повторну спробу: `[Retry] Помилка: ${err.message}. Залишилось спроб: ${retriesLeft}. Очікування ${delayMs}мс...`.
     - Робить паузу через `new Promise(res => setTimeout(res, delayMs))` і рекурсивно викликає операцію знову.
     - Якщо всі спроби вичерпано — остаточно відхиляє повернений проміс із помилкою останньої спроби (`reject(err)`).
   - Протестувати роботу `retryOperation`:
     - З функцією, яка падає 2 рази і на 3-й раз успішно повертає дані.
     - З функцією, яка падає постійно (всі 3 спроби вичерпані).

```javascript
let attempt = 0
const unstableNetworkCall = () => {
    return new Promise((resolve, reject) => {
        attempt++
        console.log(`Виклик API (спроба №${attempt})...`)
        if (attempt < 3) {
            reject(new NetworkServiceError('Збій шлюзу 502 Bad Gateway', '/api/unstable', true))
        } else {
            resolve({ success: true, data: 'Дані успішно завантажено на спробі 3!' })
        }
    })
}

retryOperation(unstableNetworkCall, 3, 200)
    .then(result => console.log('Результат Retry-стратегії:', result))
    .catch(finalErr => console.error('Всі спроби вичерпано. Фатальна помилка:', finalErr.message))
```

---

## Додаткові вимоги

1. **Обов'язкова умова вибору:**
   - Для максимальної оцінки **12 балів** обов'язково виконати **лише 1 завдання із 2-х** (на ваш вибір).
   - Якщо виконано обидва завдання — викладач оцінює найкраще, а друге зараховується як додатковий плюс та практичний бонус.
2. **Створення та наслідування кастомних помилок:**
   - Кастомні класи помилок повинні обов'язково наслідувати стандартний `Error` (`class MyError extends Error`).
   - Завжди викликати `super(message)` першим рядком конструктора.
   - Встановлювати властивість `this.name = this.constructor.name` (або ім'я класу явно), щоб назва помилки відповідала типу класу, а не залишалася `'Error'`.
3. **Обробка синхронних та асинхронних помилок:**
   - У синхронному коді з `try...catch...finally`: перехоплювати лише ті помилки, які застосунок вміє опрацьовувати (перевірка типу через `instanceof`). Невідомі або неочікувані системні помилки обов'язково повторно викидати (`throw error`).
   - У ланцюжках промісів пам'ятати про неявний `try...catch`: будь-який виняток (`throw new Error(...)`) всередині executor або обробника `.then()` автоматично перетворюється на відхилений стан промісу (rejected promise) і передається до найближчого `.catch()`.
4. **Контракт Error-First Callback та уникнення Callback Hell:**
   - Колбеки асинхронних операцій повинні суворо дотримуватися сигнатури `callback(err, result)`. При виникненні помилки першим аргументом передається об'єкт помилки, а другий залишається `undefined`/відсутній: `callback(new Error(...))`. При успіху перший аргумент дорівнює `null` або `undefined`: `callback(null, data)`.
   - Функція `promisify` повинна коректно обгортати цей контракт у конструктор `new Promise((resolve, reject) => ...)`.
5. **Робота з промісами, Thenables та ланцюжками:**
   - Завжди будувати **плоскі ланцюжки викликів** (chaining), повертаючи значення або нові проміси з `.then()`, уникаючи антипатерну вкладених `.then()`.
   - Розуміти семантику методів:
     - `.then(onFulfilled, onRejected)` — обробка результату або відхилення.
     - `.catch(onRejected)` — перехоплення відхилення; якщо з нього повертається значення, наступний крок ланцюжка отримує успішний стан (відновлення).
     - `.finally(onFinally)` — виконання завершальних дій (очищення ресурсів); не приймає аргументів і прокидає результат або помилку далі.
   - Підтримувати Thenable-об'єкти, що реалізують метод `then(resolve, reject)` відповідно до специфікації.
6. **Чистота коду та демонстрація виконання:**
   - Використовувати якісний неймінг змінних, функцій та класів.
   - Продемонструвати роботу реалізованих механізмів у консолі (`console.log`, `console.error`) на наведених або власних детальних тестових кейсах.
