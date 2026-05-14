const DATABASE_NAME = 'conservationcred-platform'
const DATABASE_VERSION = 1
const STORE_NAME = 'root_state'
const ROOT_KEY = 'platform'

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
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(ROOT_KEY)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result ?? null)
  })
}

export async function writeRootState(value) {
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(value, ROOT_KEY)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(value)
  })
}
