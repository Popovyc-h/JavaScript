# Домашнє завдання — JS Day 5: Залишкові параметри, синтаксис розширення (Spread/Rest), JSON (stringify, parse, toJSON)

для 12 балів можна зробити 2 завдання із 3рьох.

## Завдання 1. Утиліти обробки даних та конфігурацій (Rest-параметри, Spread-синтаксис)

У сучасних JavaScript-додатках та бібліотеках часто потрібно приймати довільну кількість аргументів, безпечно об'єднувати конфігурації за замовчуванням із призначеними для користувача налаштуваннями та працювати з незмінними (immutable) даними.

```javascript
const defaultSettings = {
    theme: 'light',
    language: 'uk',
    notifications: true,
    pagination: { page: 1, limit: 10 },
}
```

**Що потрібно зробити:**

1. Створити функцію `calculateStats(...numbers)`, яка приймає довільну кількість числових аргументів через залишкові параметри (rest) і повертає об'єкт зі статистикою:
    - `min` — мінімальне число (знайти за допомогою `Math.min(...numbers)`).
    - `max` — максимальне число (знайти за допомогою `Math.max(...numbers)`).
    - `sum` — сума всіх чисел.
    - `avg` — середнє арифметичне (округлене до 2 знаків після коми).
    - `count` — кількість переданих чисел.
    - Якщо передано 0 аргументів — повернути `null`.

```javascript
calculateStats(10, 5, 20, 15, 30)
// { min: 5, max: 30, sum: 80, avg: 16, count: 5 }

calculateStats() // null
```

2. Створити функцію `mergeConfigurations(defaultConfig, ...customConfigs)`, яка приймає базовий об'єкт налаштувань і довільну кількість додаткових користувацьких конфігурацій. Об'єднати їх в один **новий** об'єкт за допомогою синтаксису розширення (spread), де наступні конфігурації перекривають значення попередніх.

```javascript
const userConfig1 = { theme: 'dark', notifications: false }
const userConfig2 = { language: 'en', autoSave: true }

mergeConfigurations(defaultSettings, userConfig1, userConfig2)
// {
//   theme: 'dark',
//   language: 'en',
//   notifications: false,
//   pagination: { page: 1, limit: 10 },
//   autoSave: true
// }
```

> **Підказка:** скористайтеся `reduce` по масиву `customConfigs` або спредом всередині `Object.assign({}, defaultConfig, ...customConfigs)`.

3. Створити функцію `createLogEntry(level, message, ...tags)`, яка приймає рівень логування (`'INFO'`, `'WARN'`, `'ERROR'`), повідомлення та довільну кількість тегів:
    - Зібрати всі передані теги через rest-параметр.
    - Залишити тільки унікальні теги, використовуючи `Set` та розпакування спредом: `[...new Set(tags)]`.
    - Повернути об'єкт логу: `{ level, message, tags: [...], timestamp: new Date().toISOString() }`.

```javascript
createLogEntry('ERROR', 'Помилка з’єднання з БД', 'db', 'network', 'db', 'critical')
// {
//   level: 'ERROR',
//   message: 'Помилка з’єднання з БД',
//   tags: ['db', 'network', 'critical'],
//   timestamp: '2026-09-04T20:50:00.000Z'
// }
```

4. Створити функцію `mergeUniqueArrays(...arrays)`, яка приймає будь-яку кількість масивів і повертає єдиний плоский масив, що містить тільки унікальні значення в порядку їх першої появи. Використати spread для об'єднання масивів та `Set`.

```javascript
const arr1 = [1, 2, 3]
const arr2 = [3, 4, 5]
const arr3 = [5, 6, 1]

mergeUniqueArrays(arr1, arr2, arr3) // [1, 2, 3, 4, 5, 6]
```

5. Створити функцію `excludeKeys(obj, ...keysToExclude)`, яка приймає об'єкт та довільну кількість назв ключів, які потрібно прибрати. Функція повертає **новий** об'єкт без зазначених властивостей, не змінюючи вихідний.

```javascript
const user = { id: 1, name: 'Олексій', email: 'alex@test.com', role: 'admin', token: 'secret123' }

excludeKeys(user, 'token', 'role')
// { id: 1, name: 'Олексій', email: 'alex@test.com' }
```

> **Підказка:** можна створити поверхневу копію `{ ...obj }`, після чого видалити непотрібні ключі через `delete`, або використати `Object.entries` і `filter`.

6. Створити функцію `insertAt(array, index, ...elements)`, яка повертає **новий** масив, у якому після вказаного індексу `index` вставлено всі передані `elements`. Не модифікувати початковий масив (використати `slice` та spread).

```javascript
const numbers = [10, 20, 50, 60]
insertAt(numbers, 2, 30, 40) // [10, 20, 30, 40, 50, 60]
console.log(numbers) // [10, 20, 50, 60] (оригінал не змінився!)
```

7. Створити функцію `createPipeline(...functions)`, яка приймає довільну кількість функцій і повертає нову функцію. Отримана функція приймає початкове значення і послідовно пропускає його крізь усі функції конвеєра (зліва направо).

```javascript
const double = (x) => x * 2
const addTen = (x) => x + 10
const stringify = (x) => `Результат: ${x}`

const pipeline = createPipeline(double, addTen, stringify)
pipeline(5) // "Результат: 20" ( (5 * 2) + 10 = 20 -> "Результат: 20" )
```

---

## Завдання 2. Серіалізація та робота з форматом JSON (JSON.stringify, JSON.parse, replacer, reviver, toJSON)

Взаємодія з бекендом, збереження даних у LocalStorage або збереження знімків стану неможливі без роботи з JSON. При цьому важливо вміти приховувати чутливі дані, правильно обробляти дати та запобігати помилкам серіалізації.

```javascript
const userProfile = {
    id: 101,
    name: 'Марина Коваленко',
    email: 'marina@example.com',
    passwordHash: 'e3b0c44298fc1c149afbf4c8996fb924',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    balance: 1450.5,
    registeredAt: '2026-01-15T08:30:00.000Z',
    lastLogin: '2026-09-01T12:00:00.000Z',
    details: {
        role: 'editor',
        internalNotes: 'VIP-користувач',
        preferences: { theme: 'dark', emailUpdates: true },
    },
}
```

**Що потрібно зробити:**

1. Створити функцію `serializeWhitelist(obj, allowedProperties)`, яка перетворює об'єкт у рядок JSON, зберігаючи лише властивості із зазначеного масиву `allowedProperties`. Використати другий аргумент `JSON.stringify` (replacer у вигляді масиву властивостей).

```javascript
serializeWhitelist(userProfile, ['id', 'name', 'email', 'balance'])
// '{"id":101,"name":"Марина Коваленко","email":"marina@example.com","balance":1450.5}'
```

2. Створити функцію `serializeMasked(obj, sensitiveKeys, indent = 2)`, яка серіалізує об'єкт з красивим форматуванням (параметр `space`), при цьому рекурсивно ігнорує всі властивості, чиї імена знаходяться у списку `sensitiveKeys`. Використати `replacer` у вигляді функції `(key, value)`. Якщо ключ є у списку заборонених — повертати `undefined`.

```javascript
serializeMasked(userProfile, ['passwordHash', 'token', 'internalNotes'], 2)
// Повертає красиво відформатований рядок (2 пробіли відступу)
// без passwordHash, token та internalNotes
```

3. Створити функцію `safeParseJSON(jsonString, fallbackValue)`, яка приймає рядок JSON і повертає розпарсений об'єкт. Якщо рядок некоректний (містить синтаксичні помилки або порожній), функція не повинна кидати помилку, яка ламає програму, а має перехоплювати її через `try...catch` і повертати значення за замовчуванням `fallbackValue`.

```javascript
safeParseJSON('{"valid": true}', {}) // { valid: true }
safeParseJSON('{ invalid json, 123 }', { status: 'error' }) // { status: 'error' }
safeParseJSON('', []) // []
```

4. Створити функцію `parseWithDates(jsonString, dateFields)`, яка розбирає JSON-рядок за допомогою `JSON.parse` та функції `reviver`. Для всіх полів, чиї назви вказані у списку `dateFields`, рядок із ISO-датою має бути автоматично перетворений у справжній екземпляр `new Date()`. Для решти полів значення повертається без змін.

```javascript
const jsonString = JSON.stringify(userProfile)
const parsed = parseWithDates(jsonString, ['registeredAt', 'lastLogin'])

parsed.registeredAt instanceof Date // true
parsed.registeredAt.getFullYear() // 2026
parsed.name // "Марина Коваленко" (звичайний рядок)
```

5. Створити функцію-конструктор або фабрику `createCartItem(title, price, quantity, discount = 0)`, яка повертає об'єкт товару з методом `toJSON()`:
    - Метод `toJSON()` автоматично викликається під час `JSON.stringify`.
    - Він повинен повертати об'єкт із полями: `title`, `finalPrice` (ціна зі знижкою `price * (1 - discount)`), `quantity`, `totalCost` (`finalPrice * quantity`), округленими до 2 знаків після коми. Внутрішні поля та відсоток знижки серіалізуватися не повинні.

```javascript
const item = createCartItem('Клавіатура', 2500, 2, 0.1) // знижка 10%

JSON.stringify(item)
// '{"title":"Клавіатура","finalPrice":2250,"quantity":2,"totalCost":4500}'
```

6. Створити функцію `stringifyWithoutCycles(obj, space = 2)`, яка коректно перетворює у JSON об'єкт, навіть якщо він містить циклічні посилання. Використати replacer-функцію разом із `WeakSet` (або `Set`), щоб відстежувати вже відвідані об'єкти. Якщо об'єкт зустрічається повторно, replacer повинен замінювати його на рядок `'[Circular]'` замість викидання помилки `TypeError: Converting circular structure to JSON`.

```javascript
const department = { name: 'IT' }
const manager = { name: 'Андрій', department }
department.head = manager // циклічне посилання!

stringifyWithoutCycles(department, 2)
// Повертає валідний JSON-рядок, де поле head.department замінено на "[Circular]"
```

---

## Завдання 3. Система збереження стану та аудит-логер (Комплексне використання Spread/Rest та JSON)

У клієнтських веб-додатках часто потрібно зберігати знімки стану (State Snapshots), реалізовувати функціонал скасування дій (Undo/Redo) або синхронізувати стан з LocalStorage, використовуючи як синтаксис розширення/залишкових параметрів, так і методи JSON.

```javascript
const initialAppState = {
    session: { user: 'admin', active: true },
    ui: { sidebarOpen: false, currentView: 'dashboard' },
    counters: [10, 20, 30],
}
```

**Що потрібно зробити:**

1. Створити функцію `deepClone(obj)`, яка виконує глибоке копіювання об'єкта за допомогою методів JSON (`JSON.parse(JSON.stringify(obj))`).
    - Перевірити, що зміна властивостей або вкладених масивів у скопійованому об'єкті ніяк не впливає на оригінал.
    - Функція повинна перевіряти вхідні дані: якщо передано не об'єкт або `null`, повертати саме значення.

```javascript
const original = { a: 1, nested: { b: [1, 2, 3] } }
const copy = deepClone(original)

copy.nested.b.push(4)
console.log(original.nested.b) // [1, 2, 3] — оригінал не змінився!
```

2. Створити функцію `patchState(state, ...patches)`, яка приймає базовий стан і довільну кількість об'єктів змін (патчів). За допомогою rest-параметрів та spread-синтаксису функція повертає новий об'єкт стану, у якому всі патчі застосовано послідовно (shallow merge), при цьому оригінальний `state` залишається незмінним.

```javascript
const patch1 = { ui: { sidebarOpen: true, currentView: 'settings' } }
const patch2 = { session: { user: 'admin', active: false } }

const nextState = patchState(initialAppState, patch1, patch2)
// Повертає новий стан з оновленими session та ui
console.log(initialAppState.ui.sidebarOpen) // false (оригінал незмінний)
```

3. Створити функцію `createStateSnapshot(state, label, ...tags)`, яка створює знімок стану:
    - Зберігає повну глибоку копію `state` (через `deepClone`).
    - Зберігає мітку `label` та масив тегів `tags` (через `...tags`).
    - Містить поле `createdAt` (екземпляр `new Date()`).
    - Має власний метод `toJSON()`, який серіалізує знімок у JSON, замінюючи поле `createdAt` на форматований рядок дати та додаючи розраховану довжину рядка стану `stateSizeInBytes` (довжина `JSON.stringify(state)`).

```javascript
const snapshot = createStateSnapshot(initialAppState, 'Before Logout', 'auth', 'ui')

console.log(snapshot.tags) // ['auth', 'ui']
console.log(snapshot.createdAt instanceof Date) // true

console.log(JSON.stringify(snapshot))
// Включає: { label: 'Before Logout', tags: [...], state: {...}, createdAt: '...', stateSizeInBytes: 104 }
```

4. Створити функцію-сховище `createStore(initialState)`, яка повертає об'єкт з методами:
    - `getState()` — повертає копію поточного стану.
    - `update(updater)` — оновлює стан: якщо `updater` це функція — викликає її з поточним станом `updater(state)` і зберігає результат; якщо об'єкт — робить спред `{ ...state, ...updater }`.
    - `saveToJSON()` — повертає серіалізований рядок поточного стану.
    - `loadFromJSON(jsonString)` — відновлює стан з JSON-рядка (використовуючи безпечний парсинг). Якщо рядок валідний — стан оновлюється і метод повертає `true`, якщо помилка — стан не змінюється і повертається `false`.

```javascript
const store = createStore({ counter: 0, title: 'App' })

store.update({ counter: 5 })
console.log(store.getState()) // { counter: 5, title: 'App' }

const backup = store.saveToJSON() // '{"counter":5,"title":"App"}'

store.update((prev) => ({ ...prev, counter: prev.counter + 10 }))
console.log(store.getState().counter) // 15

store.loadFromJSON(backup)
console.log(store.getState().counter) // 5 (відновлено з бекапу)
```

5. Створити функцію `formatAuditLog(eventType, initiator, ...payloads)`, яка формує рядок журналу аудиту для відправки на сервер моніторингу:
    - Приймає назву події (`eventType`), ініціатора (`initiator`) та довільну кількість об'єктів із даними події (`...payloads`).
    - Об'єднує всі `payloads` в один об'єкт `data` за допомогою spread-синтаксису.
    - Серіалізує результат у JSON у компактному вигляді.
    - Усі поля, що закінчуються на `'Password'`, `'Secret'` або названі `'token'`, мають автоматично маскуватися значенням `'***'` через replacer.

```javascript
formatAuditLog(
    'USER_LOGIN',
    'admin@system.local',
    { ip: '192.168.1.1', userAgent: 'Chrome' },
    { userToken: 'jwt_12345', tempSecret: '9999', attempts: 1 },
)
// '{"eventType":"USER_LOGIN","initiator":"admin@system.local","data":{"ip":"192.168.1.1","userAgent":"Chrome","userToken":"***","tempSecret":"***","attempts":1}}'
```

6. Створити функцію `areStatesEqual(stateA, stateB, ...ignoredKeys)`, яка порівнює два об'єкти стану на рівність:
    - Виключає ключі, зазначені в `ignoredKeys` (наприклад, поля часових міток `'timestamp'`, `'updatedAt'`).
    - Порівнює нормалізовані JSON-рядки обох об'єктів.
    - Повертає `true`, якщо стани еквівалентні за структурою та даними, або `false` в іншому випадку.

```javascript
const s1 = { status: 'ok', count: 10, updatedAt: '2026-09-01' }
const s2 = { status: 'ok', count: 10, updatedAt: '2026-09-04' }

areStatesEqual(s1, s2, 'updatedAt') // true (оскільки updatedAt ігнорується)
areStatesEqual(s1, s2) // false
```

---

## Додаткові вимоги

1. Усі функції мають бути **чистими** (не модифікувати вхідні дані), крім спеціально призначених для цього методів у `createStore` (`update`, `loadFromJSON`).
2. **Обов'язково** використовувати:
    - Залишкові параметри (`...args`) у функціях із змінною кількістю аргументів.
    - Синтаксис розширення (`...spread`) для масивів та об'єктів замість ручного перебору або застарілих конструкцій.
    - Методи `JSON.stringify` (з параметрами `replacer` та `space`) і `JSON.parse` (з параметром `reviver`).
    - Власний метод `toJSON()` для об'єктів із кастомною серіалізацією.
3. Опрацьовувати потенційні винятки: там, де це необхідно (робота з некоректним JSON), використовувати блок `try...catch`.
4. Змінні та параметри функцій повинні мати змістовні назви (самодокументований код).
5. Тестувати кожну функцію хоча б на 2-3 прикладах (викликати функції в кінці файлу з виведенням результатів у консоль через `console.log`).
