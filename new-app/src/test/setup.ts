import '@testing-library/jest-dom/vitest'

class MemoryStorage implements Storage {
  #store = new Map<string, string>()

  get length(): number {
    return this.#store.size
  }

  clear(): void {
    this.#store.clear()
  }

  getItem(key: string): string | null {
    return this.#store.get(String(key)) ?? null
  }

  key(index: number): string | null {
    return Array.from(this.#store.keys())[index] ?? null
  }

  removeItem(key: string): void {
    this.#store.delete(String(key))
  }

  setItem(key: string, value: string): void {
    this.#store.set(String(key), String(value))
  }
}

const localStorage = new MemoryStorage()
const sessionStorage = new MemoryStorage()

Object.defineProperty(window, 'localStorage', {
  value: localStorage,
  configurable: true,
})

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorage,
  configurable: true,
})

Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  configurable: true,
  writable: true,
})

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  vi.mocked(window.scrollTo).mockClear()
})
