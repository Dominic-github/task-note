'use client'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import Header from '@/components/Header/Header'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/Tabs/Tabs'
import { useSession } from 'next-auth/react'
import { userService } from '@/services/user.service'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { passwordRegex } from '@/lib/utils'
import { Icons } from '@/components/Icons/Icons'

interface FromData {
  currentPassword: string
  newPassword: string
}

const schema = yup
  .object({
    currentPassword: yup
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .matches(
        passwordRegex,
        'Password must contain letters, numbers, and at least one special character (e.g. ., @, $, !)'
      )
      .required('Password is required'),

    newPassword: yup
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .matches(
        passwordRegex,
        'Password must contain letters, numbers, and at least one special character (e.g. ., @, $, !)'
      )
      .required('Confirm Password is required')
  })
  .required()

function Account() {
  useAuth()
  const { data: session, update: sessionUpdate } = useSession()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const [isLoading, setIsLoading] = React.useState(false)
  const [name, setUsername] = React.useState('')
  const [email, setEmail] = React.useState('')

  const [showCurrrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUsername(session?.user?.user_name || 'Guest')
        setEmail(session?.user?.user_email || 'Email')
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    fetchUser()
  }, [session])

  const handleUpdateUser = async () => {
    setIsLoading(true)

    try {
      const reponse = await userService.updateUser({
        name
      })
      if (reponse.status === 200) {
        const user = reponse.data
        if (session && session.user) {
          await sessionUpdate({
            user: user
          })
        }
        toast.success('User updated successfully!')
      }
    } catch (error: any) {
      setIsLoading(false)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePassword = async (data: FromData) => {
    setIsLoading(true)

    try {
      const reponse = await userService.updatePassword(
        data.currentPassword,
        data.newPassword
      )
      if (reponse.status === 200) {
        const user = reponse.data
        if (session && session.user) {
          await sessionUpdate({
            user: user
          })
        }
        toast.success('Password updated successfully!')
      }
    } catch (error: any) {
      setIsLoading(false)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header pageTitle="Account" />
      <Tabs defaultValue="account" className="w-[380px] p-2 mx-auto mt-8">
        <TabsList className="grid w-full grid-cols-2 ">
          <TabsTrigger
            className="cursor-pointer hover:bg-neutral-700 hover:text-white"
            value="account"
          >
            Account
          </TabsTrigger>
          <TabsTrigger
            className="cursor-pointer hover:bg-neutral-700 hover:text-white"
            value="password"
          >
            Password
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Make changes to your account here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Email</Label>
                <Input
                  id="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                type="button"
                disabled={isLoading}
                className="cursor-pointer"
                onClick={handleUpdateUser}
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <form onSubmit={handleSubmit(handleUpdatePassword)}>
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="currentPassword">Current password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrrentPassword ? 'text' : 'password'}
                      {...register('currentPassword')}
                      placeholder="Enter your current password"
                      required
                    />
                    <button
                      type="button"
                      className={`absolute p-2 right-1 top-1/2 transform -translate-y-1/2 cursor-pointer`}
                      onClick={() =>
                        setShowCurrentPassword(!showCurrrentPassword)
                      }
                    >
                      <Icons.eye className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-sm text-red-500">
                    {errors.newPassword?.message}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="newPassword">New password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      {...register('newPassword')}
                      placeholder="Enter your new password"
                      required
                    />
                    <button
                      type="button"
                      className={`absolute p-2 right-1 top-1/2 transform -translate-y-1/2 cursor-pointer`}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      <Icons.eye className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-sm text-red-500">
                    {errors.newPassword?.message}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  disabled={isLoading}
                  className="cursor-pointer"
                  type="submit"
                >
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save password
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </>
  )
}

export default Account
