# Домашнє завдання — JS Day 7: Прапори та дескриптори властивостей, Гетери та сетери, Прототипи та прототипне успадкування (F.prototype, вбудовані прототипи)

для 12 балів обов'язково зробити лише 1 завдання із 2-х на ваш вибір (інше за бажанням для додаткової практики).

---

## Завдання 1. Інкапсуляція, дескриптори властивостей та гетери/сетери (Object.defineProperty, Accessor Properties)

У розробці складних систем важливо захищати внутрішній стан об'єктів від випадкової мутації, валідувати значення під час запису, приховувати службові поля від перебору (`for...in`, `Object.keys`) та розраховувати похідні дані на льоту (обчислювані властивості).

```javascript
// Базовий об'єкт для налаштувань безпеки та конфігурацій
const sampleConfig = {
    apiKey: 'sec_live_94829104',
    environment: 'production',
    timeout: 5000,
}
```

**Що потрібно зробити:**

1. Створити функцію створення захищеного користувача `createSecureUser(initialData)`:
    - Приймає об'єкт з початковими даними: `{ id, firstName, lastName, email, role, passwordHash }`.
    - За допомогою `Object.defineProperties` або `Object.defineProperty` налаштувати прапори:
        - `id`: доступне тільки для читання (`writable: false`), не можна видалити чи перевизначити (`configurable: false`), але видиме при переборі (`enumerable: true`).
        - `passwordHash`: доступне для запису та зміни, але **приховане** від перебору в циклах і `Object.keys` (`enumerable: false`).
        - `fullName`: аксесор (гетер та сетер):
            - Гетер повертає `"<firstName> <lastName>"`.
            - Сетер приймає рядок виду `"Тарас Шевченко"`, розбиває його на дві частини та оновлює `firstName` і `lastName`. Якщо передано рядок не з двох слів, викидати помилку `new Error('Некоректний формат повного імені')`.
    - Повернути сконфігурований об'єкт.

```javascript
const user = createSecureUser({
    id: 1,
    firstName: 'Олександр',
    lastName: 'Коваль',
    email: 'koval@example.com',
    role: 'editor',
    passwordHash: 'e3b0c44298fc1c149afbf4c8996fb924',
})

console.log(user.fullName) // "Олександр Коваль"
user.fullName = 'Іван Франко'
console.log(user.firstName) // "Іван"

// id не змінюється (в strict mode викликає помилку, у non-strict ігнорується):
user.id = 999
console.log(user.id) // 1

// passwordHash не потрапляє у перелік ключів:
console.log(Object.keys(user)) // ['firstName', 'lastName', 'email', 'role', 'fullName', 'id'] (без passwordHash)
```

2. Створити функцію захисту об'єкта конфігурацій `freezeConfig(config, options = {})`:
    - Приймає об'єкт конфігурацій `config` та необов'язковий об'єкт `options` зі списком винятків `{ allowedToModify: ['timeout'] }`.
    - Для всіх власних властивостей `config` (окрім переданих у `allowedToModify`):
        - Встановити прапори `writable: false` та `configurable: false`.
    - Заборонити додавання нових властивостей до самого об'єкта через `Object.preventExtensions(config)`.
    - Повернути змінений об'єкт.

```javascript
const appConfig = {
    apiUrl: 'https://api.example.com/v1',
    port: 3000,
    debug: true,
}

freezeConfig(appConfig, { allowedToModify: ['debug'] })

appConfig.debug = false // Змінюється, бо дозволено в allowedToModify
console.log(appConfig.debug) // false

appConfig.port = 8080 // Не змінюється (writable: false)
appConfig.newProp = 'test' // Не додається (preventExtensions)
console.log(appConfig.port) // 3000
console.log(appConfig.newProp) // undefined
```

3. Створити об'єкт банківського рахунку `createBankAccount(accountNumber, initialBalance)`:
    - Внутрішній баланс зберігається у прихованій (неперелічуваній) властивості `_balance`.
    - `accountNumber`: доступний тільки для читання (`writable: false`, `configurable: false`).
    - Додати аксесор `balance`:
        - Гетер повертає баланс у відформатованому вигляді: `"<balance> грн"`.
        - Сетер забороняє встановлювати баланс менше 0 (викидає `new Error('Баланс не може бути від’ємним')`) та перевіряє, що передано число.
    - Метод `deposit(amount)`: додає гроші на баланс (перевіряє, що `amount > 0`).
    - Метод `withdraw(amount)`: списує гроші, якщо вистачає залишку, інакше виводить попередження або кидає помилку `"Недостатньо коштів"`.

```javascript
const account = createBankAccount('UA1234567890', 1000)

console.log(account.balance) // "1000 грн"
account.deposit(500)
console.log(account.balance) // "1500 грн"

account.withdraw(300)
console.log(account.balance) // "1200 грн"

// account.balance = -100 // Error: Баланс не може бути від’ємним
```

4. Створити універсальну фабрику спостережуваних властивостей `createObservableProperty(target, propName, validator)`:
    - Приймає об'єкт `target`, назву властивості `propName` та функцію-валідатор `validator(value) => boolean`.
    - Додає до `target` аксесор із гетером та сетером для `propName`.
    - Значення зберігається в окремому прихованому символі або замиканні/внутрішній властивості.
    - Сетер викликає `validator(newValue)`. Якщо валідація повертає `false`, значення не змінюється, а в консоль виводиться `console.warn("Некоректне значення для " + propName + ": " + newValue)`.
    - Якщо валідація успішна — значення оновлюється.

```javascript
const product = { title: 'Ноутбук' }

createObservableProperty(product, 'price', (val) => typeof val === 'number' && val > 0)

product.price = 25000
console.log(product.price) // 25000

product.price = -500 // Попередження в консолі, значення не змінюється
console.log(product.price) // 25000
```

5. Створити утиліту глибокого клонування об'єктів зі збереженням дескрипторів `cloneWithDescriptors(obj)`:
    - Працює за принципом створення нового об'єкта через `Object.create(Object.getPrototypeOf(obj))`.
    - Отримує всі дескриптори властивостей оригінального об'єкта через `Object.getOwnPropertyDescriptors(obj)`.
    - Визначає їх на новому об'єкті за допомогою `Object.defineProperties(newObj, descriptors)`.
    - Перевірити, що всі гетери, прапори (`writable`, `enumerable`, `configurable`) переносяться на новий об'єкт без передчасного виклику гетерів під час копіювання.

```javascript
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
console.log(copy.age) // 20
console.log(Object.getOwnPropertyDescriptor(copy, 'secret').enumerable) // false
```

---

## Завдання 2. Прототипи, прототипне успадкування та розширення вбудованих об'єктів (Prototype Chain, F.prototype, Built-in Prototypes)

Прототипне успадкування — фундамент об'єктної моделі JavaScript. Розуміння ланцюжка `[[Prototype]]`, налаштування `F.prototype`, коректне збереження посилання на `constructor` та свідоме розширення вбудованих прототипів дозволяють створювати масштабовані архітектури з мінімальним споживанням пам'яті.

```javascript
// Базовий опис базової моделі сутності
function Entity(id) {
    this.id = id
    this.createdAt = new Date()
}
```

**Що потрібно зробити:**

1. Створити ієрархію успадкування інтернет-магазину за допомогою `__proto__` або `Object.create`:
    - Базовий об'єкт `baseProduct` з властивостями та методами:
        - `currency: 'UAH'`
        - `getPriceWithTax(taxRate = 0.2)` — повертає ціну продукту з урахуванням податку: `this.price * (1 + taxRate)`.
        - `getInfo()` — повертає рядок `"[<sku>] <title> — <price> <currency>"`.
    - Об'єкт `electronics`:
        - Має свої специфічні властивості (наприклад, `warrantyMonths: 12`, `powerConsumption: '65W'`).
        - Метод `getWarrantyInfo()` — повертає `"<title>: Гарантія <warrantyMonths> міс."`.
        - Успадковує від `baseProduct`.
    - Конкретний товар `laptop`:
        - Власні поля: `sku: 'LAP-001'`, `title: 'UltraBook Pro'`, `price: 45000`.
        - Успадковує від `electronics`.
    - Продемонструвати роботу ланцюжка викликів методів та перевірити приналежність через `isPrototypeOf`.

```javascript
// Перевірка ланцюжка прототипів:
console.log(laptop.getInfo()) // "[LAP-001] UltraBook Pro — 45000 UAH"
console.log(laptop.getPriceWithTax()) // 54000
console.log(laptop.getWarrantyInfo()) // "UltraBook Pro: Гарантія 12 міс."
console.log(baseProduct.isPrototypeOf(laptop)) // true
```

2. Створити систему користувачів на функціях-конструкторах із прототипами (`F.prototype`):
    - Конструктор `User(name, email)`:
        - Власні поля: `this.name = name`, `this.email = email`, `this.isOnline = false`.
        - Методи в `User.prototype`:
            - `login()`: змінює `this.isOnline = true` і повертає `"<name> увійшов(ла) у систему"`.
            - `logout()`: змінює `this.isOnline = false` і повертає `"<name> вийшов(ла) із системи"`.
            - `getProfile()`: повертає інформацію про користувача та його статус.
    - Конструктор `Admin(name, email, permissions)`:
        - Викликає конструктор батька: `User.call(this, name, email)`.
        - Власне поле: `this.permissions = permissions` (масив рядків, наприклад `['read', 'write', 'delete']`).
        - Налаштовує успадкування прототипу від `User.prototype` через `Object.create(User.prototype)`.
        - **Важливо:** обов'язково відновити коректний `Admin.prototype.constructor = Admin`.
        - Додати власний метод в `Admin.prototype`:
            - `hasPermission(perm)`: повертає `true/false`.
            - `banUser(targetUser)`: виводить повідомлення `"Адміністратор <name> заблокував <targetUser.name>"`.

```javascript
const admin = new Admin('Олена', 'admin@shop.ua', ['read', 'write', 'delete'])

console.log(admin.login()) // "Олена увійшов(ла) у систему"
console.log(admin.hasPermission('delete')) // true
console.log(admin.constructor === Admin) // true (не втрачено посилання на конструктор!)
console.log(admin instanceof User) // true
```

3. Реалізувати безпечне поліфіл-розширення вбудованих прототипів `String.prototype` та `Array.prototype`:
    - Додати до `String.prototype` метод `capitalizeWords()`:
        - Робить першу літеру кожного слова великою, а решту малими (наприклад, `"привіт чудовий світ" -> "Привіт Чудовий Світ"`).
    - Додати до `Array.prototype` метод `chunk(size)`:
        - Розбиває масив на підмасиви довжиною `size`. Наприклад, `[1, 2, 3, 4, 5].chunk(2) -> [[1, 2], [3, 4], [5]]`.
    - **Обов'язкова вимога:** додавати методи через `Object.defineProperty` з прапором `enumerable: false`, щоб нові методи не з'являлися в циклах `for...in`.
    - Робити перевірку: якщо метод із такою назвою вже існує в прототипі — не перезаписувати його.

```javascript
if (!String.prototype.capitalizeWords) {
    Object.defineProperty(String.prototype, 'capitalizeWords', {
        value: function () {
            return this.split(' ')
                .map((word) => (word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : ''))
                .join(' ')
        },
        enumerable: false,
        writable: true,
        configurable: true,
    })
}

console.log('javaScript прототипне успадкування'.capitalizeWords())
// "Javascript Прототипне Успадкування"

const numbers = [1, 2, 3, 4, 5, 6, 7]
console.log(numbers.chunk(3)) // [[1, 2, 3], [4, 5, 6], [7]]
```

4. Створити функцію створення "чистого словника" (словника без прототипу) `createDictionary()`:
    - Створює та повертає об'єкт без прототипу (`Object.create(null)`).
    - Додати до словника метод `toString()`, який повертає список усіх ключів словника, розділених комами (наприклад, через `Object.keys(this).join(', ')`).
    - Зробити властивість `toString` неперелічуваною (`enumerable: false`), щоб вона не поверталася серед ключів словника.
    - Продемонструвати, що у такому об'єкті не конфліктують службові імена (наприклад, `dict['__proto__'] = 'value'`, `dict['toString'] = 'custom'`).

```javascript
const dict = createDictionary()
dict.apple = 'Яблуко'
dict.banana = 'Банан'
dict.__proto__ = 'Тест прототипу'

console.log(dict.apple) // "Яблуко"
console.log(dict.__proto__) // "Тест прототипу" (звичайна властивість, не прототип!)
console.log(String(dict)) // "apple, banana, __proto__" (викликається наш toString)
```

5. Створити інструмент аналізу ланцюжка прототипів `getPrototypeChain(obj)`:
    - Приймає будь-який об'єкт.
    - За допомогою циклу та `Object.getPrototypeOf(current)` обходить весь ланцюг прототипів до `null`.
    - Повертає масив з назвами прототипів (наприклад, ім'я конструктора `proto.constructor?.name` або `'[Object: null prototype]'`).
    - Додатково перевірити роботу для різних типів: масиву `[]`, звичайного об'єкта `{}`, функції `function() {}` та створеного екземпляра `Admin`.

```javascript
console.log(getPrototypeChain([]))
// ['Array', 'Object', null]

console.log(getPrototypeChain(admin))
// ['Admin', 'User', 'Object', null]

console.log(getPrototypeChain(Object.create(null)))
// [null]
```

---

## Додаткові вимоги

1. **Обов'язкова умова вибору:**
    - Для максимальної оцінки **12 балів** обов'язково виконати **лише 1 завдання із 2-х** (на ваш вибір).
    - Якщо виконано обидва завдання — оцінюється найкраще, а друге зараховується як додатковий плюс/бонус.
2. **Прапори та дескриптори:**
    - Чітко розуміти та контролювати атрибути властивостей: `writable`, `enumerable`, `configurable`.
    - Пам'ятати: методи, додані до вбудованих прототипів або в службові об'єкти, мають додаватися як `enumerable: false`.
3. **Збереження прототипного ланцюжка та конструктора:**
    - При успадкуванні через `F.prototype` не забувати відновлювати властивість `constructor` дочірнього конструктора (`Child.prototype.constructor = Child`).
    - Розуміти різницю між `__proto__` (геттер/сеттер посилання на прототип) та `prototype` (властивість функції-конструктора).
4. **Чистота коду та неймінг:**
    - Змінні, параметри та функції повинні мати змістовні самодокументовані назви.
5. **Тестування:**
    - Перевірити роботу створених функцій на 2-3 прикладах викликів із виведенням результатів у консоль (`console.log`).
