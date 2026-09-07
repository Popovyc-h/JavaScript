const initialAppState = {
  session: { user: 'admin', active: true },
  ui: { sidebarOpen: false, currentView: 'dashboard' },
  counters: [10, 20, 30],
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function patchState(state, ...patches) {
  return patches.reduce(
    (acc, patch) => {
      return {
        ...acc,
        ...patch,
      }
    },
    { ...state },
  )
}

function createStateSnapshot(state, label, ...tags) {
  const stateCopy = deepClone(state)

  return {
    state: stateCopy,
    label,
    tags,
    createdAt: new Date(),

    toJSON() {
      return {
        ...this,
        createdAt: this.createdAt.toISOString(),
        stateSizeInBytes: JSON.stringify(this.state).length,
      }
    },
  }
}

function createStore(initialState) {
  let state = { ...initialState }

  return {
    getState() {
      return { ...state }
    },
    update(updater) {
      if (typeof updater === 'function') {
        state = updater(state)
      } else if (typeof updater === 'object') {
        state = { ...state, ...updater }
      }
    },
    saveToJSON() {
      return JSON.stringify(state, null, 2)
    },
    loadFromJSON(jsonString) {
      try {
        const parsedState = JSON.parse(jsonString)
        state = parsedState
        return true
      } catch (error) {
        return false
      }
    },
  }
}

function formatAuditLog(eventType, initiator, ...payloads) {}

// const original = { a: 1, nested: { b: [1, 2, 3] } }
// const copy = deepClone(original)

// copy.nested.b.push(4)
// console.log(copy.nested.b)
// console.log(original.nested.b)

// const patch1 = { ui: { sidebarOpen: true, currentView: 'settings' } }
// const patch2 = { session: { user: 'admin', active: false } }

// const nextState = patchState(initialAppState, patch1, patch2)
// console.log(initialAppState.ui.sidebarOpen)
// console.log(JSON.stringify(nextState, null, 2))

// const snapshot = createStateSnapshot(initialAppState, 'Before Logout', 'auth', 'ui')

// console.log(snapshot.tags)
// console.log(snapshot.createdAt instanceof Date)

// console.log(JSON.stringify(snapshot, null, 2))

// const store = createStore({ counter: 0, title: 'App' })

// store.update({ counter: 5 })
// console.log(store.getState())

// const backup = store.saveToJSON()
// console.log(backup)

// store.update((prev) => ({ ...prev, counter: prev.counter + 10 }))
// console.log(store.getState().counter)

// store.loadFromJSON(backup)
// console.log(store.getState().counter)

// formatAuditLog(
//   'USER_LOGIN',
//   'admin@system.local',
//   { ip: '192.168.1.1', userAgent: 'Chrome' },
//   { userToken: 'jwt_12345', tempSecret: '9999', attempts: 1 },
// )
