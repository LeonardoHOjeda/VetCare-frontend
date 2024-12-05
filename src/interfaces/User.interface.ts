interface Role {
  id: string
  name: string
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  phone: string
  avatar: string
  role_id: number
  email_verified_at: string
  role: Role
}

export interface UserWithoutRole extends Omit<User, 'role'> {
  role_id: number
}
