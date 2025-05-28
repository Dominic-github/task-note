'use client'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import { AppSidebar } from '@/components/Siderbar/Sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import PageLoading from '../Loading/Loading'

const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password']

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated') {
      if (!publicRoutes.includes(pathname)) {
        router.replace(
          `/auth/login?callbackUrl=${encodeURIComponent(pathname)}`
        )
      }
    } else if (status === 'authenticated') {
      if (publicRoutes.includes(pathname)) {
        router.replace('/')
      }
    }
  }, [status, pathname, router])

  if (status === 'loading') {
    return <PageLoading />
  }

  if (
    pathname === '/auth/logout' ||
    (publicRoutes.includes(pathname) && status === 'unauthenticated')
  ) {
    return <>{children}</>
  } else {
    if (
      !publicRoutes.includes(pathname) ||
      (status === 'authenticated' && !publicRoutes.includes(pathname))
    ) {
      return (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      )
    }
  }

  return null
}
