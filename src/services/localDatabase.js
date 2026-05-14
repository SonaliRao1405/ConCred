const DATABASE_NAME = 'conservationcred-platform'
const DATABASE_VERSION = 1
const STORE_NAME = 'root_state'
const ROOT_KEY = 'platform'
const ROOT_BACKUP_KEY = 'conservationcred-platform-backup'
const AUTH_REGISTRY_KEY = 'conservationcred-auth-registry'

function readStorageJson(key) {
  try {
    const rawValue = window.localStorage.getItem(key)
    return rawValue ? JSON.parse(rawValue) : null
  } catch {
    return null
  }
}

function writeStorageJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function removeStorageKey(key) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    return
  }
}

function createAuthRegistrySnapshot(value) {
  return {
    activities: [],
    meta: value?.meta ?? null,
    moduleProgress: [],
    organizations: value?.organizations ?? [],
    queue: [],
    savingsGoals: value?.savingsGoals ?? [],
    session: value?.session ?? { userId: null, authMode: 'local' },
    transactions: [],
    users: value?.users ?? [],
  }
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME)
      }
    }
  })
}

export async function readRootState() {
  try {
    const database = await openDatabase()

    const indexedState = await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(ROOT_KEY)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result ?? null)
    })

    if (indexedState) {
      writeStorageJson(AUTH_REGISTRY_KEY, createAuthRegistrySnapshot(indexedState))
      writeStorageJson(ROOT_BACKUP_KEY, indexedState)
      return indexedState
    }
  } catch {
    // Fall through to browser storage mirrors.
  }

  return readStorageJson(ROOT_BACKUP_KEY) ?? readStorageJson(AUTH_REGISTRY_KEY)
}

export async function writeRootState(value) {
  writeStorageJson(AUTH_REGISTRY_KEY, createAuthRegistrySnapshot(value))
  writeStorageJson(ROOT_BACKUP_KEY, value)

  try {
    const database = await openDatabase()

    await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(value, ROOT_KEY)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(value)
    })
  } catch {
    return value
  }

  return value
}

export async function clearRootState() {
  removeStorageKey(ROOT_BACKUP_KEY)
  removeStorageKey(AUTH_REGISTRY_KEY)

  try {
    const database = await openDatabase()
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(ROOT_KEY)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(null)
    })
  } catch {
    return
  }
}
