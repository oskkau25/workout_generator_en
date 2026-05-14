export interface AccountProfile {
  userId: string
  displayName: string
  avatarUrl?: string
  createdAt: string
}

export interface AuthSession {
  userId: string
  accessToken: string
  expiresAt: string
}

export interface AccountGateway {
  getCurrentProfile(): Promise<AccountProfile | null>
  getCurrentSession(): Promise<AuthSession | null>
  signIn?(): Promise<void>
  signOut?(): Promise<void>
}
