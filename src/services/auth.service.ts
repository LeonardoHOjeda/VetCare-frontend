import axiosClient from '@/network/client'

class AuthService {
  async login(email: string, password: string) {
    const response = await axiosClient.post('/auth/login', {
      email,
      password
    })

    return response.data
  }
}

export const authService = new AuthService()
