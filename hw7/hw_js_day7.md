# Домашнє завдання — JS Day 6: Планування викликів (setTimeout, setInterval), Декоратори та переадресація (call, apply)

для 12 балів обов'язково зробити лише 1 завдання із 2-х на ваш вибір (інше за бажанням для додаткової практики).

---

## Завдання 1. Система планування, таймери та асинхронні інтервали (setTimeout, setInterval)

У фронтенд-розробці та бекенді на Node.js таймери використовуються повсюдно: опитування сервера (polling), таймери зворотного відліку, автозбереження форми через інтервал часу, керування відкладеними сповіщеннями та фоновими задачами.

```javascript
// Базовий приклад сповіщення або фонового завдання
const sampleTask = {
    id: 101,
    title: 'Синхронізація локальних даних',
    priority: 'high',
}
```

**Що потрібно зробити:**

1. Створити функцію `delayedGreeting(name, delay, callback)`, яка:
   - Приймає ім'я `name`, затримку `delay` (у мілісекундах) та функцію зворотного виклику `callback`.
   - За допомогою `setTimeout` планує виклик `callback` через вказаний час `delay`.
   - Передає у `callback` рядок вітання `"Привіт, <name>!"` та реальний час виконання.
   - Повертає ідентифікатор таймера (`timerId`), щоб виклик можна було за потреби скасувати через `clearTimeout`.

```javascript
const timerId = delayedGreeting('Олексій', 1000, (greeting, time) => {
    console.log(`${greeting} (Виконано о: ${time})`)
})
// Через 1 секунду виведе: Привіт, Олексій! (Виконано о: 14:35:00)

// Можливість скасування:
// clearTimeout(timerId);
```

2. Створити функцію виведення чисел `printNumbersInterval(from, to, stepDelay)` та альтернативну версію `printNumbersTimeout(from, to, stepDelay)`:
   - Обидві функції повинні послідовно виводити в консоль числа від `from` до `to` з інтервалом `stepDelay` мс (наприклад, щосекунди: 1, 2, 3, 4, 5).
   - `printNumbersInterval` має бути реалізована через `setInterval` та зупинятися через `clearInterval`, коли досягнуто числа `to`.
   - `printNumbersTimeout` має бути реалізована за допомогою **рекурсивного (вкладеного) `setTimeout`**, плануючи наступний виклик тільки після завершення поточного.

```javascript
printNumbersInterval(1, 5, 1000)
// Виводить: 1 (через 1с), 2 (через 2с), 3, 4, 5 (і зупиняється)

printNumbersTimeout(10, 12, 500)
// Виводить: 10, 11, 12 з паузою 500мс між числами
```

3. Створити функцію зворотного відліку `createCountdown(seconds, onTick, onComplete)`:
   - Запускає інтервал кожну секунду (1000 мс).
   - Щосекунди зменшує лічильник на 1 та викликає колбек `onTick(remainingSeconds)`.
   - Коли лічильник доходить до 0, зупиняє таймер і одноразово викликає `onComplete()`.
   - Функція повертає об'єкт управління з методами:
     - `pause()` — призупиняє відлік;
     - `resume()` — продовжує відлік з моменту зупинки;
     - `stop()` — повністю зупиняє та скидає таймер.

```javascript
const countdown = createCountdown(
    5,
    sec => console.log(`Залишилось: ${sec} сек`),
    () => console.log('Час вичерпано!')
)

// Через 2 секунди можна призупинити:
// setTimeout(() => countdown.pause(), 2000);
// Через 4 секунди відновити:
// setTimeout(() => countdown.resume(), 4000);
```

4. Створити функцію динамічного опитування сервера (Polling із Backoff) `pollWithDynamicInterval(action, initialInterval, maxInterval, maxAttempts)`:
   - Використовує вкладений `setTimeout`.
   - Викликає функцію `action(attemptNumber)`, яка повертає `true` (успіх/готово) або `false` (потрібно повторити).
   - Якщо `action` повертає `false`, інтервал очікування до наступної спроби збільшується в 1.5 раза (exponential backoff), але не перевищує `maxInterval`.
   - Опитування завершується, якщо `action` повернула `true` або кількість спроб досягла `maxAttempts`.

```javascript
let attempts = 0
pollWithDynamicInterval(
    attempt => {
        console.log(`Спроба #${attempt}`)
        return ++attempts === 3 // на 3-й спробі повертає true і завершує
    },
    500,  // початковий інтервал 500мс
    4000, // максимальний інтервал 4000мс
    5     // максимум 5 спроб
)
```

5. Створити планувальник відкладених завдань `createTaskScheduler()`:
   - Дозволяє планувати завдання через метод `schedule(taskName, delay, fn)`. Повертає унікальний числовий або рядковий `taskId`.
   - Метод `cancel(taskId)` — скасовує виконання ще не запущеного завдання через `clearTimeout`.
   - Метод `getActiveTasks()` — повертає масив запланованих та ще не виконаних завдань з їх назвами та часом.
   - Метод `cancelAll()` — скасовує всі заплановані активні таймери.

```javascript
const scheduler = createTaskScheduler()

const id1 = scheduler.schedule('Завантаження аватара', 2000, () => console.log('Аватар завантажено'))
const id2 = scheduler.schedule('Синхронізація контактів', 5000, () => console.log('Контакти оновлено'))

console.log(scheduler.getActiveTasks()) // [{ id: 1, name: 'Завантаження аватара', delay: 2000 }, ...]

scheduler.cancel(id1) // Скасовує перше завдання
```

---

## Завдання 2. Декоратори функцій, переадресація викликів (call/apply) та оптимізація (debounce, throttle)

Декоратори — це функції-обгортки, які приймають цільову функцію та повертають нову функцію зі зміненою або розширеною поведінкою (логування, кешування, захист від частих кліків тощо), не вносячи змін у код самої функції.

```javascript
// Приклад сервісу для розрахунку вартості замовлення
const orderService = {
    taxRate: 0.2,
    calculateTotal(price, discount = 0) {
        const discounted = price - (price * discount)
        return discounted + (discounted * this.taxRate)
    }
}
```

**Що потрібно зробити:**

1. Створити кешуючий декоратор з підтримкою кількох аргументів та контексту `cachingDecorator(func, hashFn)`:
   - Працює як для звичайних функцій, так і для методів об'єктів (коректно зберігає та передає контекст `this` через `func.apply(this, arguments)` або `func.call(this, ...args)`).
   - Приймає кастомну функцію хешування аргументів `hashFn(args)`. Якщо `hashFn` не передана — використовує хешування за замовчуванням (наприклад, `[].join.call(args)` або `JSON.stringify(args)`).
   - Якщо результат для таких аргументів уже обчислено, повертає його з внутрішньої колекції `Map`.
   - Надає декорованій функції метод `clearCache()`, який очищає поточний кеш.

```javascript
orderService.calculateTotal = cachingDecorator(orderService.calculateTotal)

console.log(orderService.calculateTotal(100, 0.1)) // Обчислюється: 108
console.log(orderService.calculateTotal(100, 0.1)) // Повертається з кешу: 108

orderService.calculateTotal.clearCache() // Очищення кешу
```

2. Створити шпигунський декоратор `spyDecorator(func)`:
   - Зберігає історію всіх викликів у властивість `calls` самої функції-обгортки.
   - Кожен запис у масиві `calls` повинен містити масив переданих аргументів (`args`) та час виклику (`timestamp`).
   - Повністю передає контекст `this` та повертає результат роботи цільової функції.

```javascript
function sendEmail(to, subject) {
    return `Лист надіслано до ${to}: ${subject}`
}

const spiedSendEmail = spyDecorator(sendEmail)

spiedSendEmail('user@test.com', 'Вітаємо!')
spiedSendEmail('admin@test.com', 'Звіт за день')

console.log(spiedSendEmail.calls.length) // 2
console.log(spiedSendEmail.calls[0].args) // ['user@test.com', 'Вітаємо!']
console.log(spiedSendEmail.calls[0].timestamp) // рядок з датою або Date
```

3. Створити затримуючий декоратор `delayDecorator(func, ms)`:
   - Повертає обгортку, яка відкладає виконання `func` на `ms` мілісекунд за допомогою `setTimeout`.
   - Коректно передає контекст `this` та всі аргументи оригіналу (зверніть увагу на збереження `this` всередині таймауту).

```javascript
function logAction(action, target) {
    console.log(`[${this?.role || 'Гість'}] Дія: ${action}, ціль: ${target}`)
}

const user = {
    role: 'Модератор',
    logAction: delayDecorator(logAction, 1500)
}

user.logAction('Блокування', 'User #42')
// Через 1.5 секунди виведе: [Модератор] Дія: Блокування, ціль: User #42
```

4. Створити декоратор усунення брязкоту `debounceDecorator(func, wait)`:
   - Відкладає виклик `func` доти, доки не мине `wait` мілісекунд спокою з моменту останнього виклику обгортки.
   - Якщо обгортка викликається знову до спливання таймауту, попередній таймаут скасовується через `clearTimeout`, і таймер запускається наново.
   - Гарантує збереження контексту `this` та передачу найактуальніших аргументів останнього виклику.
   - Додати метод `cancel()` до декорованої функції для можливості скасувати запланований виклик.

```javascript
function onSearchInput(query) {
    console.log(`Пошуковий запит відправлено: ${query}`)
}

const debouncedSearch = debounceDecorator(onSearchInput, 300)

debouncedSearch('j')
debouncedSearch('jav')
debouncedSearch('javas')
debouncedSearch('javascript')
// Тільки через 300мс після останнього виклику спрацює:
// "Пошуковий запит відправлено: javascript"
```

5. Створити декоратор обмеження частоти `throttleDecorator(func, limit)`:
   - Забезпечує, що `func` викликається не частіше ніж 1 раз на `limit` мілісекунд.
   - Перший виклик у періоді виконується негайно.
   - Якщо під час "заморозки" надходили нові виклики, останній із них має автоматично виконатися після закінчення періоду `limit` із передачею актуального контексту `this` та останніх аргументів.

```javascript
function updateScrollPosition(x, y) {
    console.log(`Позиція скролу: x=${x}, y=${y}`)
}

const throttledScroll = throttleDecorator(updateScrollPosition, 1000)

throttledScroll(0, 100) // Виконується негайно!
throttledScroll(0, 200) // Затримується
throttledScroll(0, 350) // Буде викликано автоматично через 1000мс після першого
```

6. Створити функцію композиції декораторів `composeDecorators(...decorators)`:
   - Приймає довільну кількість декораторів і повертає функцію, яка послідовно застосовує їх усі до цільової функції.
   - Продемонструвати роботу, об'єднавши `spyDecorator` та `cachingDecorator` (або `delayDecorator`).

```javascript
function multiply(a, b) {
    return a * b
}

const enhance = composeDecorators(
    spyDecorator,
    fn => cachingDecorator(fn, args => args.join('x'))
)

const smartMultiply = enhance(multiply)
console.log(smartMultiply(3, 4)) // 12 (обчислення)
console.log(smartMultiply(3, 4)) // 12 (з кешу)
console.log(smartMultiply.calls.length) // 2 (зафіксовано шпигуном)
```

---

## Додаткові вимоги

1. **Обов'язкова умова вибору:**
   - Для максимальної оцінки **12 балів** обов'язково виконати **лише 1 завдання із 2-х** (на ваш вибір).
   - Якщо виконано обидва завдання — оцінюється найкраще, а друге зараховується як додатковий плюс/бонус.
2. **Переадресація контексту та аргументів:**
   - У всіх функціях-декораторах обов'язково передавати контекст `this` та аргументи через `func.apply(this, arguments)` або `func.call(this, ...args)`.
   - Пам'ятати про стрілкові функції для збереження лексичного `this` всередині колбеків `setTimeout`.
3. **Керування ресурсами таймерів:**
   - Завжди своєчасно очищати таймери через `clearTimeout` / `clearInterval` для уникнення витоків пам'яті та небажаних побічних ефектів.
4. **Чистота коду та неймінг:**
   - Змінні, параметри та функції повинні мати змістовні самодокументовані назви.
5. **Тестування:**
   - Перевірити роботу створених функцій на 2-3 прикладах викликів із виведенням результатів у консоль (`console.log`).
