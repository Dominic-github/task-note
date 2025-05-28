import axiosInstance from '@/lib/axios'
import { signIn } from 'next-auth/react'

interface RegisterData {
  email: string
  password: string
  confirmPassword: string
}

interface LoginData {
  email: string
  password: string
}

export const authService = {
  register: async (data: RegisterData) => {
    return await axiosInstance.post('/auth/register', data)
  },

  login: async (data: LoginData) => {
    return await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false
    })
  },

  refreshAccessToken: async (userId: string, refreshToken: string) => {
    axiosInstance.defaults.headers.common['x-client-id'] = userId
    axiosInstance.defaults.headers.common['x-refresh-token'] =
      `Bearer ${refreshToken}`

    const response = await axiosInstance.post('/auth/refresh-token')
    if (response.status === 200) {
      return response
    } else {
      throw new Error('Failed to refresh access token')
    }
  },

  getProfile: async () => {
    return await axiosInstance.get('/auth/profile')
  },

  logout: async () => {
    return await axiosInstance.post('/auth/logout')
  }
}
