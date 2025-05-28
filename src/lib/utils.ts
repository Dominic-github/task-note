import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[.@$!%*?&]).{8,}$/
