import type { AccountGateway } from '@/services/accounts/account-types'

export const noopAccountGateway: AccountGateway = {
  async getCurrentProfile() {
    return null
  },
  async getCurrentSession() {
    return null
  },
  async signIn() {
    return
  },
  async signOut() {
    return
  },
}
