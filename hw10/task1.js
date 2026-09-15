class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.timestamp = new Date()
  }
}

class ValidationError extends AppError {
  constructor(message, field = null) {
    super(message, 400)
    this.field = field
  }
}

class PropertyRequiredError extends ValidationError {
  constructor(property) {
    super(`Відсутня обов'язкова властивість: ${property}`, property)
  }
}

class DatabaseError extends AppError {
  constructor(message, originalError = null) {
    super(message, 503)
    this.cause = originalError
  }
}

function parseAndValidateUser(jsonString) {
  try {
    let user
    try {
      user = JSON.parse(jsonString)
    } catch (err) {
      throw new ValidationError('Невалідний JSON-формат')
    }

    const properties = ['name', 'email', 'age']

    for (const property of properties) {
      if (!user[property]) {
        throw new PropertyRequiredError(property)
      }
    }

    if (typeof user.age !== 'number' || user.age < 18) {
      throw new ValidationError('Вік повинен бути не менше 18 років', 'age')
    }

    if (typeof user.settings === 'string') {
      try {
        user.settings = JSON.parse(user.settings)
      } catch (err) {
        throw new ValidationError('Невалідний формат налаштувань', 'settings')
      }
    }

    return user
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        success: false,
        error: error.name,
        field: error.field,
        message: error.message,
        status: error.statusCode,
      }
    }

    throw error
  } finally {
    console.log('[Audit] Спроба валідації завершена.')
  }
}

function fetchUserFromDB(userId, callback) {
  setTimeout(() => {
    if (!userId || userId <= 0) {
      callback(new DatabaseError('Користувача не знайдено'))
    } else {
      callback(null, { id: userId, name: 'Ольга', role: 'editor' })
    }
  }, 200)
}

function fetchUserPermissions(role, callback) {
  setTimeout(() => {
    if (role === 'guest') {
      callback(null, ['read'])
    } else if (role === 'editor') {
      callback(null, ['read', 'write', 'publish'])
    } else {
      callback(new AppError('Невідома роль', 403))
    }
  }, 150)
}

function logUserAccess(userId, action, callback) {
  setTimeout(() => {
    callback(null, { logged: true, timestamp: Date.now() })
  }, 100)
}

const promisify = (fn) => {
  return (...arg) => {
    return new Promise((resolve, reject) => {
      fn(...arg, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
}

const err1 = new PropertyRequiredError('email')
console.log(err1.name)
console.log(err1.message)
console.log(err1.field)
console.log(err1.statusCode)
console.log(err1 instanceof ValidationError)
console.log(err1 instanceof AppError)
console.log(err1 instanceof Error)

const validJson = JSON.stringify({ name: 'Олексій', email: 'alex@work.ua', age: 24 })
console.log(parseAndValidateUser(validJson))

const missingFieldJson = JSON.stringify({ name: 'Анна', age: 20 })
console.log(parseAndValidateUser(missingFieldJson))

const underageJson = JSON.stringify({ name: 'Іван', email: 'ivan@test.ua', age: 16 })
console.log(parseAndValidateUser(underageJson))

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

const fetchUserFromDBPromise = promisify(fetchUserFromDB)
fetchUserFromDBPromise(101)
  .then((user) => console.log('Отримано користувача через Promise:', user.name))
  .catch((err) => console.error('Помилка:', err.message))

let sessionData = {}
const fetchUserPermissionsPromise = promisify(fetchUserPermissions)
const logUserAccessPromise = promisify(logUserAccess)

fetchUserFromDBPromise(101)
  .then((user) => {
    sessionData.user = user
    return fetchUserPermissionsPromise(user.role)
  })
  .then((permissions) => {
    sessionData.permissions = permissions
    return logUserAccessPromise(sessionData.user.id, 'dashboard_view')
  })
  .then((logResult) => {
    sessionData.log = logResult
    console.log('Повна сесія зібрана успішно:', sessionData)
  })
  .catch((error) => {
    console.error(`[${error.name} | Status: ${error.statusCode || 500}]: ${error.message}`)
  })
  .finally(() => {
    console.log('Сесійний пайплайн завершив роботу. Ресурси звільнено.')
  })
