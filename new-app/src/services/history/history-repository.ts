import type { WorkoutHistoryEntry, WorkoutHistoryStore } from '@/services/storage/storage-types'
import { workoutHistoryStore } from '@/services/storage/workout-history-store'

export interface HistoryRepositoryContext {
  userId?: string
}

export interface WorkoutHistoryRepository {
  listRecent(context?: HistoryRepositoryContext, limit?: number): Promise<WorkoutHistoryEntry[]>
  save(entry: WorkoutHistoryEntry, context?: HistoryRepositoryContext): Promise<void>
  sync?(context?: HistoryRepositoryContext): Promise<void>
}

export class LocalWorkoutHistoryRepository implements WorkoutHistoryRepository {
  private readonly store: WorkoutHistoryStore

  constructor(store: WorkoutHistoryStore = workoutHistoryStore) {
    this.store = store
  }

  async listRecent(contextOrLimit?: HistoryRepositoryContext | number, limit?: number) {
    const resolvedLimit = typeof contextOrLimit === 'number' ? contextOrLimit : limit
    return this.store.list(resolvedLimit)
  }

  async save(entry: WorkoutHistoryEntry) {
    await this.store.append(entry)
  }

  async sync() {
    return
  }
}

export const workoutHistoryRepository = new LocalWorkoutHistoryRepository()
