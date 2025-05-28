import axios from 'axios'
import dotenv from 'dotenv'
import { getSession } from 'next-auth/react'
dotenv.config()

let isInterceptorAttached = false
export const setupSessionInterceptor = () => {
  if (isInterceptorAttached) return
  isInterceptorAttached = true

  axiosInstance.interceptors.request.use(
    async (config) => {
      const session = await getSession() // Lấy session token

      if (session?.accessToken) {
        config.headers = config.headers || {}
        config.headers['Authorization'] = `Bearer ${session.accessToken}`
        config.headers['x-client-id'] = `${session.user?._id}`
      }

      return config
    },
    (error) => Promise.reject(error)
  )
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXTAUTH_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': process.env.NEXTAUTH_URL || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, x-api-key, x-client-id'
  }
})

axiosInstance.interceptors.request.use((config) => {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY
  if (apiKey) {
    config.headers['x-api-key'] = apiKey
  }
  return config
})

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      if (status === 401) {
        console.error('Unauthorized, redirecting to login...')
      }

      return Promise.reject({
        status,
        message: data?.message || 'An error occurred',
        errors: data?.errors || []
      })
    } else if (error.request) {
      return Promise.reject({
        status: null,
        message: 'No response received from server'
      })
    } else {
      // Lỗi khi thiết lập request
      return Promise.reject({
        status: null,
        message: error.message
      })
    }
  }
)

export default axiosInstance
