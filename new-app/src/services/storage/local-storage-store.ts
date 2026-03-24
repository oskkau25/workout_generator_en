export class LocalStorageStore<TValue> {
  private readonly key: string

  constructor(key: string) {
    this.key = key
  }

  async load(): Promise<TValue | null> {
    const raw = window.localStorage.getItem(this.key)
    if (!raw) {
      return null
    }

    try {
      return JSON.parse(raw) as TValue
    } catch {
      return null
    }
  }

  async save(value: TValue): Promise<void> {
    window.localStorage.setItem(this.key, JSON.stringify(value))
  }

  async clear(): Promise<void> {
    window.localStorage.removeItem(this.key)
  }
}
