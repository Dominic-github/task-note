// store/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IUser {
  _id: string
  user_name: string
  user_email: string
  user_avatar: string
  user_slug: string
  user_verify: boolean
  user_role: number
}

interface AuthState {
  user: IUser | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
    }
  }
})

export const { setUser, setLoading, setError, logout } = authSlice.actions
export default authSlice.reducer
