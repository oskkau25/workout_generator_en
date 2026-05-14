import '@testing-library/jest-dom/vitest'

class AudioParamStub {
  value = 0

  exponentialRampToValueAtTime(value: number) {
    this.value = value
  }
}

class AudioNodeStub {
  connect() {}
}

class AudioOscillatorStub extends AudioNodeStub {
  type = 'sine'
  frequency = { value: 0 }
  onended: (() => void) | null = null

  start() {}

  stop() {
    this.onended?.()
  }
}

class AudioGainStub extends AudioNodeStub {
  gain = new AudioParamStub()
}

class AudioContextStub {
  currentTime = 0
  destination = {}

  createOscillator() {
    return new AudioOscillatorStub()
  }

  createGain() {
    return new AudioGainStub()
  }

  close() {
    return Promise.resolve()
  }
}

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

Object.defineProperty(window, 'AudioContext', {
  value: AudioContextStub,
  configurable: true,
  writable: true,
})

Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: vi.fn(),
    cancel: vi.fn(),
  },
  configurable: true,
  writable: true,
})

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  value: class {
    text: string
    rate = 1
    pitch = 1

    constructor(text: string) {
      this.text = text
    }
  },
  configurable: true,
  writable: true,
})

Object.defineProperty(navigator, 'wakeLock', {
  value: {
    request: vi.fn().mockResolvedValue({
      release: vi.fn().mockResolvedValue(undefined),
    }),
  },
  configurable: true,
})

Object.defineProperty(navigator, 'vibrate', {
  value: vi.fn(),
  configurable: true,
})

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  vi.mocked(window.scrollTo).mockClear()
  vi.mocked(window.speechSynthesis.speak).mockClear()
  vi.mocked(window.speechSynthesis.cancel).mockClear()
  vi.mocked(navigator.vibrate).mockClear()
})
