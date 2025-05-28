'use client'
import * as React from 'react'
import { Github, HomeIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DatePicker } from '@/components/DatePicker/DatePicker'
import { NavUser } from '@/components/NavUser/NavUser'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator
} from '@/components/ui/sidebar'
import { useSession } from 'next-auth/react'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const { data: session } = useSession()
  const [user, setUser] = React.useState({
    name: '',
    email: '',
    avatar: '/images/default.jpg'
  })

  const handlehomeClick = () => {
    router.push('/')
  }

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        setUser({
          name: session?.user?.user_name || 'Guest',
          email: session?.user?.user_email || 'Email',
          avatar: session?.user?.user_avatar || '/images/default.jpg'
        })
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    fetchUser()
  }, [session])

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser user={user} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenuButton
            className="p-1 cursor-pointer"
            onClick={handlehomeClick}
          >
            <HomeIcon className="h-4 w-4" />
            Home
          </SidebarMenuButton>
        </SidebarGroup>
        <SidebarSeparator className="mx-0" />
        <DatePicker />
        <SidebarSeparator className="mx-0" />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="">
              <a
                href="https://github.com/dominic-github"
                className="text-center w-full flex items-center justify-center gap-2 text-sm font-normal"
              >
                <Github className="h-4 w-4" />
                Dominic-github @ 2025
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
