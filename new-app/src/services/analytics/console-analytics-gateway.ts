import type { AnalyticsEvent, AnalyticsGateway } from '@/services/analytics/analytics-types'

export class ConsoleAnalyticsGateway implements AnalyticsGateway {
  async track(event: AnalyticsEvent) {
    console.info('[analytics]', event)
  }
}
