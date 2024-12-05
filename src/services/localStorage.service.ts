import type { User } from '@/models/User'

class LocalStorageService {
  get token(): string | null {
    return localStorage.getItem('token')
  }

  set token(token: string | null) {
    if (!token) {
      localStorage.removeItem('token')
      return
    }
    localStorage.setItem('token', token || '')
  }

  get user(): { user: User; token: string } | null {
    const user = localStorage.getItem('user')
    if (user == null) return null

    return JSON.parse(user)
  }

  set user(user: User) {
    localStorage.setItem('user', JSON.stringify(user))
  }

  clear(): void {
    localStorage.clear()
  }
}

export const localStorageService = new LocalStorageService()
