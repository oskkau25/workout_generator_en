import type { AnalyticsGateway } from '@/services/analytics/analytics-types'

export const noopAnalyticsGateway: AnalyticsGateway = {
  async track() {
    return
  },
}
