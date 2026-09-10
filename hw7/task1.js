const sampleTask = {
  id: 101,
  title: 'Синхронізація локальних даних',
  priority: 'high',
}

function delayedGreeting(name, delay, callback) {
  const timerId = setTimeout(() => {
    const greeting = `привіт, ${name}!`
    const time = new Date().toLocaleTimeString()

    callback(greeting, time)
  }, delay)

  return timerId
}

function printNumbersInterval(from, to, stepDelay) {
  let current = from

  const timerId = setInterval(() => {
    console.log(current)
    if (current === to) {
      clearInterval(timerId)
    }
    current++
  }, stepDelay)
}

function printNumbersTimeout(from, to, stepDelay) {
  let current = from

  function run() {
    console.log(current)
    if (current < to) {
      setTimeout(() => {
        run()
      }, stepDelay)
    }
    current++
  }

  run()
}

function createCountdown(seconds, onTick, onComplete) {
  let counter = seconds
  let timerId

  function startTimer() {
    timerId = setInterval(() => {
      counter--
      onTick(counter)

      if (counter === 0) {
        clearInterval(timerId)
        timerId = null
        onComplete()
      }
    }, 1000)
  }
  startTimer()

  return {
    pause() {
      clearInterval(timerId)
      timerId = null
    },

    resume() {
      if (timerId === null) {
        startTimer()
      }
    },

    stop() {
      clearInterval(timerId)
      counter = seconds
      timerId = null
    },
  }
}

function pollWithDynamicInterval(action, initialInterval, maxInterval, maxAttempts) {
  let attemptNumber = 1
  let currentInterval = initialInterval

  function poll() {
    if (!action(attemptNumber)) {
      currentInterval *= 1.5

      if (currentInterval > maxInterval) {
        currentInterval = maxInterval
      }

      attemptNumber++
      if (attemptNumber > maxAttempts) {
        return
      }

      setTimeout(() => {
        poll()
      }, currentInterval)
    } else {
      return
    }
  }

  setTimeout(() => {
    poll()
  }, initialInterval)
}

function createTaskScheduler() {
  let tasks = []
  let nextId = 1

  return {
    schedule(taskName, delay, fn) {
      let curentId = nextId++

      const timerId = setTimeout(() => {
        fn()
        tasks = tasks.filter((task) => task.id !== curentId)
      }, delay)

      tasks.push({ id: curentId, name: taskName, delay, timerId })

      return curentId
    },

    cancel(taskId) {
      let task = tasks.find((t) => t.id === taskId)
      if (task) {
        clearTimeout(task.timerId)
        tasks = tasks.filter((t) => t.id !== taskId)
      }
    },

    getActiveTasks() {
      return tasks.map((task) => ({ id: task.id, name: task.name, delay: task.delay }))
    },

    cancelAll() {
      tasks.forEach((t) => clearTimeout(t.timerId))
      tasks = []
    },
  }
}

const timerId = delayedGreeting('Олексій', 5000, (greeting, time) => {
  console.log(`${greeting} (Виконано о: ${time})`)
})

printNumbersInterval(1, 5, 1000)
printNumbersTimeout(10, 12, 500)

const countdown = createCountdown(
  5,
  (sec) => console.log(`Залишилось: ${sec} сек`),
  () => console.log('Час вичерпано!'),
)

setTimeout(() => {
  countdown.pause()
  console.log('pause')
}, 4000)

setTimeout(() => {
  console.log('resume:')
  countdown.resume()
}, 6000)

let attempts = 0
pollWithDynamicInterval(
  (attempt) => {
    console.log(`Спроба #${attempt}`)
    return ++attempts === 3
  },
  500,
  4000,
  5,
)

const scheduler = createTaskScheduler()

const id1 = scheduler.schedule('Завантаження аватара', 2000, () => console.log('Аватар завантажено'))
const id2 = scheduler.schedule('Синхронізація контактів', 5000, () => console.log('Контакти оновлено'))

console.log(scheduler.getActiveTasks())

scheduler.cancel(id1)
