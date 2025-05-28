import axiosInstance from '@/lib/axios'

interface IUserUpdate {
  name?: string
  email?: string
}

export const userService = {
  getMe: async () => {
    try {
      const response = await axiosInstance.get('/user/me')
      if (response.status === 200) {
        return response.data
      } else {
        throw new Error('Failed to fetch user data')
      }
    } catch (_error) {
      throw new Error('Error fetching user data')
    }
  },

  getUser: async (userId: string) => {
    try {
      const response = await axiosInstance.get(`/user/${userId}`)
      if (response.status === 200) {
        return response.data
      } else {
        throw new Error('Failed to fetch user data')
      }
    } catch (_error) {
      throw new Error('Error fetching user data')
    }
  },

  updateUser: async (data: IUserUpdate) => {
    return await axiosInstance.patch(`/user`, {
      user_name: data.name
    })
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    return await axiosInstance.patch(`/user`, {
      currentPassword,
      newPassword
    })
  }
}
