import axiosClient from '@/network/client'

class UsersService {
  async fetchUsers() {
    const users = await axiosClient.get('/users')

    console.log('Users:', users)

    return users.data
  }
}

export const usersService = new UsersService()
