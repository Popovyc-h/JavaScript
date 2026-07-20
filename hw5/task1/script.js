const employees = [
  { id: 1, name: 'Олена', position: 'developer', salary: 45000, department: 'IT' },
  { id: 2, name: 'Іван', position: 'designer', salary: 38000, department: 'Design' },
  { id: 3, name: 'Петро', position: 'developer', salary: 50000, department: 'IT' },
  { id: 4, name: 'Марія', position: 'manager', salary: 55000, department: 'Management' },
  { id: 5, name: 'Анна', position: 'designer', salary: 35000, department: 'Design' },
]

const filterByDepartment = function (employees, department) {
  return employees.filter((emp) => emp.department === department)
}

const getSalariesByDepartment = function (employees, department) {
  return filterByDepartment(employees, department).map((emp) => emp.salary)
}

const findEmployeeById = function (employees, id) {
  return employees.find((emp) => emp.id === id)
}

const sortBySalary = function (employees, order) {
  let result = employees.slice()

  if (order === 'asc') {
    return result.sort((a, b) => a.salary - b.salary)
  }
  if (order === 'desc') {
    return result.sort((a, b) => b.salary - a.salary)
  }

  return result
}

const calculateTotalBudget = function (employees) {
  return employees.reduce((acc, employee) => {
    return acc + employee.salary
  }, 0)
}

const getTopPaidEmployees = function ({ employees, count }) {
  return sortBySalary(employees, 'desc').slice(0, count)
}

const updateSalary = function (employees, id, newSalary) {
  return employees.map((employees) => {
    if (employees.id === id) {
      return { ...employees, salary: newSalary }
    } else {
      return employees
    }
  })
}

const getEmployeeNamesString = function (employees) {
  return employees.map((employee) => employee.name).join(', ')
}

console.log(filterByDepartment(employees, 'IT'))
console.log(getSalariesByDepartment(employees, 'Design'))
console.log(findEmployeeById(employees, 3))
console.log(sortBySalary(employees, 'desc'))
console.log(calculateTotalBudget(employees))
console.log(getTopPaidEmployees({ employees, count: 3 }))
console.log(updateSalary(employees, 2, 42000))
console.log(getEmployeeNamesString(employees))
