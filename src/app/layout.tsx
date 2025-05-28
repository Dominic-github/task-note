import './globals.css'
import { Providers } from '@/components/Providers/providers'
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <title>Task - todo</title>
      <body>
        <Providers>
          <ProtectedRoute>{children}</ProtectedRoute>
        </Providers>
      </body>
    </html>
  )
}
