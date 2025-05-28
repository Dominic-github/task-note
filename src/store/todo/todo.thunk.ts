// store/todo.thunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit'
import { todoService } from '@/services/todo.service'
import { TodoItem } from './todoSlice'

export const fetchTodos = createAsyncThunk<TodoItem[], Date>(
  'todos/fetchTodos',
  async (day: Date) => {
    const response = await todoService.getTodos(day)
    return response
  }
)

export const createTodo = createAsyncThunk<
  TodoItem,
  { title: string; createAt: string }
>('todos/createTodo', async ({ title, createAt }) => {
  const response = await todoService.addTodo(title, createAt)
  return response.data
})

export const toggleTodoCompleted = createAsyncThunk<TodoItem, string>(
  'todos/toggleTodoCompleted',
  async (id: string) => {
    const response = await todoService.toggleTodoCompleted(id)
    return response.data
  }
)

export const updateTodo = createAsyncThunk<
  TodoItem,
  { id: string; data: TodoItem }
>('todos/updateTodo', async ({ id, data }) => {
  const response = await todoService.updateTodo(id, data)
  return response.data
})

export const deleteTodoAsync = createAsyncThunk<string, string>(
  'todos/deleteTodo',
  async (id: string) => {
    const response = await todoService.deleteTodo(id)
    return response.data._id
  }
)

export const deleteAllTodoAsync = createAsyncThunk<void, Date>(
  'todos/deleteAllTodos',
  async (day: Date) => {
    await todoService.clearAllTodosDay(day)
  }
)
