import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import Link from 'next/link'
import { HomeIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

function Header({ pageTitle }: { pageTitle?: string }) {
  return (
    <header className="sticky top-0 flex h-16 shrink-0 items-center border-b bg-background ">
      <SidebarTrigger className="p-6 m-2 cursor-pointer " />
      <Separator orientation="vertical" className=" h-4" />
      <Link
        href="/"
        className="p-4 m-2 rounded-md hover:bg-accent/50 hover:text-accent-foreground"
      >
        <HomeIcon className={cn('size-4')} />
      </Link>
      <Separator orientation="vertical" className=" h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="m-4">{pageTitle}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}

export default Header
