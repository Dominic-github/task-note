import { IUser } from '@/store/authSlice'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    user?: IUser
  }
}
