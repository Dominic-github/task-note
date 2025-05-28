import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/store/auth/authSlice'
import todoReducer from '@/store/todo/todoSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
