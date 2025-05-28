'use client'
import { useAuth } from '@/hooks/useAuth'
import axiosInstance from '@/lib/axios'
import { authService } from '@/services/auth.service'
import { logout } from '@/store/auth/authSlice'
import { signOut } from 'next-auth/react'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'

function Logout() {
  useAuth()
  const dispatch = useDispatch()
  const handleLogout = async () => {
    try {
      const response = await authService.logout()
      if (response && response.status === 200) {
        delete axiosInstance.defaults.headers.common['Authorization']
        await signOut({ redirect: false })
        dispatch(logout())
        toast.success('Logout successful')
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    handleLogout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <></>
}

export default Logout
