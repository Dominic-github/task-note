import { IUser } from '@/store/authSlice'
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    user?: IUser
  }
}
