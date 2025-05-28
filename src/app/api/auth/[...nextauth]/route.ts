import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axiosInstance from '@/lib/axios'
import { jwtDecode } from 'jwt-decode'
import { authService } from '@/services/auth.service'

interface JwtPayload {
  exp: number
  iat?: number
  [key: string]: any
}

export const authOptions: any = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        try {
          const res = await axiosInstance.post('/auth/login', {
            email: credentials?.email,
            password: credentials?.password
          })

          if (!res.data?.user || !res.data?.tokens?.accessToken) {
            throw new Error('Invalid login response')
          }

          const decodedAccess = jwtDecode<JwtPayload>(
            res.data.tokens.accessToken
          )
          const decodedRefresh = jwtDecode<JwtPayload>(
            res.data.tokens.refreshToken
          )

          return {
            id: res.data.user._id || res.data.user.email,
            name: res.data.user.user_name || null,
            email: res.data.user.user_email || null,
            image: res.data.user.user_avatar || null,
            data: res.data.user,
            accessToken: res.data.tokens.accessToken,
            refreshToken: res.data.tokens.refreshToken,
            accessTokenExpires: decodedAccess.exp * 1000,
            refreshTokenExpires: decodedRefresh.exp * 1000
          }
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      const now = Date.now()

      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.accessTokenExpires = user.accessTokenExpires
        token.refreshTokenExpires = user.refreshTokenExpires
        token.user = user.data
        return token
      }

      if (trigger === 'update' && session?.user) {
        token.user = {
          ...token.user,
          ...session.user
        }
        return token
      }

      if (
        token.accessTokenExpires &&
        now < token.accessTokenExpires - 5 * 60 * 1000
      ) {
        return token
      }

      try {
        const response = await authService.refreshAccessToken(
          token.user._id,
          token.refreshToken
        )

        if (response.status !== 200) {
          return null
        }

        const decodedAccess = jwtDecode<JwtPayload>(
          response.data.tokens.accessToken
        )
        const decodedRefresh = jwtDecode<JwtPayload>(
          response.data.tokens.refreshToken
        )
        token.accessToken = response.data.tokens.accessToken
        token.refreshToken = response.data.tokens.refreshToken
        token.accessTokenExpires = decodedAccess.exp * 1000
        token.refreshTokenExpires = decodedRefresh.exp * 1000

        return token
      } catch (error) {
        return null
      }
    },

    async session({ session, token }: any) {
      session.user = token.user
      session.accessToken = token.accessToken
      session.error = token.error
      return session
    }
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
