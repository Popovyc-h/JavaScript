# Домашнє завдання — JS Day 4: Методи масивів, Object.keys/values/entries, Map, Set, деструктуризація

для 12 балів можна зробити 2 завдання із 3рьох.

## Завдання 1. Управління базою співробітників (Методи масивів, Деструктуризація)

У CRM-системах часто потрібно фільтрувати, сортувати, групувати та аналізувати дані співробітників.

```javascript
const employees = [
    { id: 1, name: 'Олена', position: 'developer', salary: 45000, department: 'IT' },
    { id: 2, name: 'Іван', position: 'designer', salary: 38000, department: 'Design' },
    { id: 3, name: 'Петро', position: 'developer', salary: 50000, department: 'IT' },
    { id: 4, name: 'Марія', position: 'manager', salary: 55000, department: 'Management' },
    { id: 5, name: 'Анна', position: 'designer', salary: 35000, department: 'Design' },
]
```

**Що потрібно зробити:**

1. Створити функцію `filterByDepartment(employees, department)`, яка повертає масив співробітників вказаного відділу. Використати `filter`.

```javascript
filterByDepartment(employees, 'IT')
// [{ id: 1, name: 'Олена', ... }, { id: 3, name: 'Петро', ... }]
```

2. Створити функцію `getSalariesByDepartment(employees, department)`, яка повертає масив зарплат співробітників відділу. Використати `filter` + `map`.

```javascript
getSalariesByDepartment(employees, 'Design') // [38000, 35000]
```

3. Створити функцію `findEmployeeById(employees, id)`, яка знаходить співробітника за `id`. Використати `find`.

```javascript
findEmployeeById(employees, 3) // { id: 3, name: 'Петро', ... }
```

4. Створити функцію `sortBySalary(employees, order)`, яка сортує співробітників за зарплатою. `order` може бути `'asc'` (за зростанням) або `'desc'` (за спаданням). Використати `sort` з функцією порівняння. **Не модифікувати** оригінальний масив — створити копію через `slice()`.

```javascript
sortBySalary(employees, 'desc')
// [{ id: 4, salary: 55000 }, { id: 3, salary: 50000 }, ...]
```

5. Створити функцію `calculateTotalBudget(employees)`, яка рахує загальний бюджет на зарплати. Використати `reduce`.

```javascript
calculateTotalBudget(employees) // 223000
```

6. Створити функцію `getTopPaidEmployees(employees, count)`, яка повертає `count` співробітників з найбільшою зарплатою. Використати `sort`, `slice` та деструктуризацію в параметрах (функція приймає об'єкт `{ employees, count }` через деструктуризацію).

```javascript
getTopPaidEmployees({ employees, count: 3 })
// [{ id: 4, salary: 55000 }, { id: 3, salary: 50000 }, { id: 1, salary: 45000 }]
```

> **Підказка:** параметр функції: `function getTopPaidEmployees({ employees, count })`.

7. Створити функцію `updateSalary(employees, id, newSalary)`, яка повертає **новий** масив з оновленою зарплатою співробітника. Використати `map` з деструктуризацією елемента.

```javascript
updateSalary(employees, 2, 42000)
// співробітник з id=2 тепер має salary: 42000
```

> **Підказка:** в `map` використайте деструктуризацію: `employees.map(({ id, ...rest }) => ...)`.

8. Створити функцію `getEmployeeNamesString(employees)`, яка повертає рядок імен, розділених комою. Використати `map` + `join`.

```javascript
getEmployeeNamesString(employees) // "Олена, Іван, Петро, Марія, Анна"
```

---

## Завдання 2. Обробка даних інтернет-магазину (Object.keys/values/entries, Map)

В інтернет-магазині дані про товари часто приходять у вигляді об'єктів, але для зручності пошуку їх перетворюють у Map.

```javascript
const inventory = {
    'apple': { price: 30, quantity: 100 },
    'banana': { price: 25, quantity: 50 },
    'orange': { price: 40, quantity: 0 },
    'grape': { price: 60, quantity: 30 },
    'pear': { price: 35, quantity: 0 },
}
```

**Що потрібно зробити:**

1. Створити функцію `getProductNames(inventory)`, яка повертає масив назв товарів. Використати `Object.keys`.

```javascript
getProductNames(inventory) // ['apple', 'banana', 'orange', 'grape', 'pear']
```

2. Створити функцію `getTotalValue(inventory)`, яка рахує загальну вартість всіх товарів на складі (price × quantity). Використати `Object.values` та `reduce`.

```javascript
getTotalValue(inventory) // 30*100 + 25*50 + 40*0 + 60*30 + 35*0 = 6050
```

3. Створити функцію `getAvailableProducts(inventory)`, яка повертає об'єкт лише з тими товарами, де `quantity > 0`. Використати `Object.entries`, `filter`, `Object.fromEntries`.

```javascript
getAvailableProducts(inventory)
// { apple: { price: 30, quantity: 100 }, banana: { price: 25, quantity: 50 }, grape: { price: 60, quantity: 30 } }
```

4. Створити функцію `convertToMap(inventory)`, яка конвертує об'єкт `inventory` у `Map`. Використати `Object.entries` та конструктор `new Map()`.

```javascript
const productMap = convertToMap(inventory)
productMap.get('apple') // { price: 30, quantity: 100 }
productMap.has('orange') // true
productMap.size // 5
```

5. Створити функцію `updateInventory(map, productName, quantityChange)`, яка приймає `Map` і оновлює кількість товару:
   - Якщо товар існує — змінити його `quantity` на нове значення.
   - Якщо товару немає — додати новий запис з `price: 0` та вказаною `quantity`.
   - Повернути той самий `Map`.

```javascript
const map = convertToMap(inventory)
updateInventory(map, 'apple', 200)
// apple тепер має quantity: 200

updateInventory(map, 'kiwi', 15)
// додано новий товар 'kiwi' з price: 0, quantity: 15
```

6. Створити функцію `getLowStockProducts(inventory, threshold)`, яка приймає об'єкт і повертає масив назв товарів, де `quantity` менше `threshold`. Використати `Object.entries`, `filter`, `map`.

```javascript
getLowStockProducts(inventory, 40) // ['banana', 'orange', 'pear']
```

> **Підказка:** використайте деструктуризацію в `filter`: `Object.entries(inventory).filter(([name, product]) => product.quantity < threshold)`.

7. Створити функцію `applyDiscountToAvailable(inventory, discountPercent)`, яка приймає об'єкт `inventory` і застосовує знижку лише до товарів, які є в наявності (`quantity > 0`). Повернути **новий** об'єкт. Використати `Object.entries` + `map` + `Object.fromEntries`.

```javascript
applyDiscountToAvailable(inventory, 10)
// { apple: { price: 27, quantity: 100 }, banana: { price: 22.5, quantity: 50 }, grape: { price: 54, quantity: 30 } }
// товари з quantity = 0 (orange, pear) — не включені
```

---

## Завдання 3. Система тегування та фільтрації контенту (Set, Ітеративні об'єкти, Array.from)

На багатьох сайтах (блоги, портфоліо, інтернет-магазини) використовують теги для категоризації контенту.

```javascript
const articles = [
    { id: 1, title: 'Основи JavaScript', tags: ['js', 'frontend', 'beginner'] },
    { id: 2, title: 'Просунутий React', tags: ['react', 'frontend', 'advanced'] },
    { id: 3, title: 'Node.js для початківців', tags: ['nodejs', 'backend', 'beginner'] },
    { id: 4, title: 'CSS Grid Layout', tags: ['css', 'frontend', 'intermediate'] },
    { id: 5, title: 'Express.js API', tags: ['nodejs', 'backend', 'advanced'] },
    { id: 6, title: 'TypeScript в React', tags: ['typescript', 'react', 'frontend', 'intermediate'] },
]
```

**Що потрібно зробити:**

1. Створити функцію `getAllTags(articles)`, яка збирає всі унікальні теги зі статей. Використати `Set`.

```javascript
getAllTags(articles) // Set { 'js', 'frontend', 'beginner', 'react', 'advanced', 'nodejs', 'backend', 'css', 'intermediate', 'typescript' }
```

> **Підказка:** спочатку зібрати всі масиви тегів через `flatMap` або `reduce`, потім створити `Set`.

2. Створити функцію `getTagCount(articles)`, яка повертає об'єкт, де ключ — тег, а значення — кількість статей з цим тегом. Використати `forEach` та `Object.entries` або `Map`.

```javascript
getTagCount(articles)
// { js: 1, frontend: 4, beginner: 2, react: 2, advanced: 2, nodejs: 2, backend: 2, css: 1, intermediate: 2, typescript: 1 }
```

3. Створити функцію `getArticlesByTag(articles, tag)`, яка повертає масив статей з вказаним тегом. Використати `filter` та `includes`.

```javascript
getArticlesByTag(articles, 'react')
// [{ id: 2, title: 'Просунутий React', ... }, { id: 6, title: 'TypeScript в React', ... }]
```

4. Створити функцію `addTag(articles, articleId, tag)`, яка додає тег до статті і повертає **новий** масив:
   - Якщо тег вже є у статті — нічого не додавати.
   - Якщо статті з таким `id` немає — повернути копію масиву.
   - Використати `map`, деструктуризацію, `Set` для перевірки унікальності тегу.

```javascript
addTag(articles, 1, 'javascript')
// стаття з id=1 тепер має теги: ['js', 'frontend', 'beginner', 'javascript']

addTag(articles, 1, 'js')
// тег 'js' вже є — масив не змінюється
```

> **Підказка:** всередині `map` знайдіть потрібну статтю, створіть `Set` з її тегів, додайте новий тег, перетворіть назад у масив через `Array.from`.

5. Створити функцію `getTagsWithArticles(articles)`, яка повертає об'єкт, де ключ — тег, а значення — масив назв статей з цим тегом. Використати `reduce` та деструктуризацію.

```javascript
getTagsWithArticles(articles)
// {
//   js: ['Основи JavaScript'],
//   frontend: ['Основи JavaScript', 'Просунутий React', 'CSS Grid Layout', 'TypeScript в React'],
//   react: ['Просунутий React', 'TypeScript в React'],
//   ...
// }
```

6. Створити функцію `createArticleRange(from, to)`, яка робить об'єкт `range` ітерабельним (через `Symbol.iterator`), щоб він працював з `for..of` і повертав числа від `from` до `to` включно. Потім використати `Array.from` для перетворення результату в масив.

```javascript
// Створити об'єкт range
const range = createArticleRange(1, 5)

// Має працювати:
// for (let num of range) { console.log(num) } // 1, 2, 3, 4, 5
// Array.from(range) // [1, 2, 3, 4, 5]
```

> **Підказка:** реалізуйте метод `[Symbol.iterator]()`, який повертає об'єкт з методом `next()`, що повертає `{ done: boolean, value: number }`.

7. Використовуючи `Array.from` та `Math.random`, створити функцію `generateArticleViews(articleCount)`, яка створює масив випадкових чисел (кількість переглядів) заданої довжини. Кожне число має бути цілим від 0 до 10000.

```javascript
generateArticleViews(5) // [3421, 7890, 1234, 5678, 9012] (випадкові числа)
```

---

## Додаткові вимоги

1. Усі функції мають бути **чистими** (не модифікувати вхідні дані), крім `updateInventory` та `addTag` (які свідомо змінюють колекцію).
2. **Дозволяється** використовувати методи масивів (`map`, `filter`, `reduce`, `sort`, `forEach`, `find`, `includes`, `indexOf`, `slice`, `splice`, `concat`, `join`, `split`, `flatMap`, `Array.isArray`, `Array.from`).
3. **Дозволяється** використовувати `Map`, `Set`, `Object.keys/values/entries`, `Object.fromEntries`.
4. **Дозволяється** використовувати деструктуризацію масивів та об'єктів.
5. Коментувати код не потрібно, але назви змінних мають бути змістовними.
6. Тестувати кожну функцію хоча б на 2-3 прикладах (можна просто викликати в кінці файлу і виводити результат у консоль).
