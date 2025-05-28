'use client'

import { Calendar } from '@/components/ui/calendar'
import { SidebarGroup, SidebarGroupContent } from '@/components/ui/sidebar'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { setSelectedDate } from '@/store/todo/todoSlice'

export function DatePicker() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [visibleMonth, setVisibleMonth] = useState<Date>(new Date())
  const dispatch = useAppDispatch()

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    dispatch(setSelectedDate(selectedDate?.toISOString() ?? null))
  }

  const handleToday = () => {
    const today = new Date()
    setVisibleMonth(today)
    dispatch(setSelectedDate(today.toISOString()))
    setDate(today)
  }

  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent>
        <Calendar
          mode="single"
          selected={date}
          month={visibleMonth}
          onSelect={handleSelect}
          onMonthChange={setVisibleMonth}
          className="[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[33px]
          "
        />
        <div className="w-full flex justify-end pr-3">
          <Button
            variant="outline"
            size="sm"
            className=""
            onClick={handleToday}
          >
            Today
          </Button>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
