// components/loading.tsx
'use client'

import { Spinner } from '@/components/ui/spinner' // Import Spinner từ shadcn/ui
import { cn } from '@/lib/utils' // Sử dụng utility class của shadcn

export default function Loading({
  className,
  text = 'Loading...'
}: {
  className?: string
  text?: string
}) {
  return (
    <div
      className={cn(
        'fixed inset-0 flex flex-col items-center justify-center bg-background/80 z-50',
        className
      )}
    >
      <Spinner className="h-10 w-10 text-primary" />
      {text && <p className="mt-4 text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}
