'use client'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useDispatch } from 'react-redux'
import { setUser, setLoading } from '@/store/auth/authSlice'
import { setupSessionInterceptor } from '@/lib/axios'
import { usePathname, useRouter } from 'next/navigation'

export const useAuth = () => {
  const { data: session, status } = useSession()
  const dispatch = useDispatch()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'loading') {
      dispatch(setLoading(true))
    } else if (status === 'authenticated') {
      if (session && session.user) {
        const fetchUser = async () => {
          try {
            setupSessionInterceptor()
            if (session.user) {
              dispatch(setUser(session.user))
            }
          } catch (error) {
            router.replace(
              `/auth/login?callbackUrl=${encodeURIComponent(pathname)}`
            )
          }
        }
        fetchUser()
      } else {
        router.replace(
          `/auth/login?callbackUrl=${encodeURIComponent(pathname)}`
        )
      }
      dispatch(setLoading(false))
    }
  }, [session, status, dispatch])
}
