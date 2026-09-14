const sampleUserData = {
  id: 101,
  name: 'Марина Ковальчук',
  email: 'marina@tech.ua',
  age: 26,
  role: 'manager',
  settings: '{"theme":"dark","notifications":true}',
}

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
