import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodoAsync,
  toggleTodoCompleted,
  deleteAllTodoAsync
} from './todo.thunk'

interface TodoState {
  todos: TodoItem[]
  loading: boolean
  error: string | null
  selectedDate: string | null
}

export interface TodoItem {
  _id: string
  user_id?: string
  todo_title?: string
  todo_description?: string
  todo_completed?: boolean
  createdAt?: string
  updatedAt?: string
}

const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
  selectedDate: new Date().toISOString()
}

export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<TodoItem>) => {
      state.todos.push(action.payload)
    },
    setSelectedDate: (state, action: PayloadAction<string | null>) => {
      state.selectedDate = action.payload
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((todo) => todo._id === action.payload)
      if (todo) {
        todo.todo_completed = !todo.todo_completed
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo._id !== action.payload)
    },
    clearAllTodos: (state) => {
      state.todos = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload || []
        state.loading = false
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch todos'
      })

      .addCase(createTodo.pending, (state) => {
        state.loading = true
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.todos.unshift(action.payload)
        state.loading = false
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to create todo'
      })

      .addCase(toggleTodoCompleted.pending, (state) => {
        state.loading = true
      })
      .addCase(toggleTodoCompleted.fulfilled, (state, action) => {
        const updatedTodo = action.payload
        const index = state.todos.findIndex(
          (todo) => todo._id === updatedTodo._id
        )
        if (index !== -1) {
          state.todos[index] = {
            ...state.todos[index],
            ...updatedTodo
          }
        }
        state.loading = false
      })
      .addCase(toggleTodoCompleted.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to create todo'
      })

      .addCase(updateTodo.pending, (state) => {
        state.loading = true
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const updatedTodo = action.payload
        const index = state.todos.findIndex(
          (todo) => todo._id === updatedTodo._id
        )
        if (index !== -1) {
          state.todos[index] = updatedTodo
        }
        state.loading = false
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to create todo'
      })

      .addCase(deleteTodoAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteTodoAsync.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo._id !== action.payload)
        state.loading = false
      })
      .addCase(deleteTodoAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to delete todo'
      })

      .addCase(deleteAllTodoAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteAllTodoAsync.fulfilled, (state) => {
        state.todos = []
        state.loading = false
      })
      .addCase(deleteAllTodoAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to delete todo'
      })
  }
})

export const {
  addTodo,
  toggleTodo,
  deleteTodo,
  clearAllTodos,
  setSelectedDate
} = todoSlice.actions
export default todoSlice.reducer
