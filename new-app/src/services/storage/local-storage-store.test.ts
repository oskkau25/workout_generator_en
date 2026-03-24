import { LocalStorageStore } from '@/services/storage/local-storage-store'

describe('LocalStorageStore', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('loads parsed values when stored JSON is valid', async () => {
    const store = new LocalStorageStore<{ mode: string }>('test-storage-key')
    window.localStorage.setItem('test-storage-key', JSON.stringify({ mode: 'valid' }))

    await expect(store.load()).resolves.toEqual({ mode: 'valid' })
  })

  it('returns null when stored JSON is corrupt', async () => {
    const store = new LocalStorageStore<{ mode: string }>('test-storage-key')
    window.localStorage.setItem('test-storage-key', '{not-valid-json')

    await expect(store.load()).resolves.toBeNull()
  })
})
