import axiosInstance from '@/lib/axios'
import { TodoItem } from '@/store/todo/todoSlice'

export const todoService = {
  getTodos: async (day: Date) => {
    const response = await axiosInstance.get('/todo/day', {
      params: {
        day: day.toISOString()
      }
    })
    if (response.status === 200) {
      return response.data
    } else {
      return []
    }
  },

  addTodo: async (title: string, createAt: string) => {
    return await axiosInstance.post('/todo', {
      todo_title: title,
      createdAt: createAt
    })
  },

  toggleTodoCompleted: async (id: string) => {
    return await axiosInstance.patch(`/todo/${id}/toggle`)
  },

  updateTodo: async (id: string, data: TodoItem) => {
    return await axiosInstance.patch(`/todo/${id}`, data)
  },

  deleteTodo: async (id: string) => {
    return await axiosInstance.delete(`/todo/${id}`)
  },

  clearAllTodosDay: async (day: Date) => {
    return await axiosInstance.delete('/todo/all/day', {
      params: {
        day: day
      }
    })
  }
}
