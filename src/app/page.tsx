'use client'
import React, { useEffect, useState } from 'react'
import Header from '@/components/Header/Header'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2 } from 'lucide-react'

import {
  createTodo,
  fetchTodos,
  deleteTodoAsync,
  deleteAllTodoAsync,
  toggleTodoCompleted
} from '@/store/todo/todo.thunk'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAuth } from '@/hooks/useAuth'
import { TodoItem } from '@/store/todo/todoSlice'
import { Icons } from '@/components/Icons/Icons'

export default function TodoApp() {
  useAuth()
  const dispatch = useAppDispatch()

  const [newTodo, setNewTodo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const selectedDate = useSelector(
    (state: RootState) => state.todos.selectedDate
  )
  const todos = useSelector((state: RootState) => state.todos.todos)

  useEffect(() => {
    if (selectedDate) {
      dispatch(fetchTodos(new Date(selectedDate)))
    }
  }, [dispatch, selectedDate])

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return

    setIsLoading(true)
    if (newTodo.trim()) {
      await dispatch(
        createTodo({
          title: newTodo,
          createAt: selectedDate || new Date().toISOString()
        })
      )
      setNewTodo('')
    }
    await setIsLoading(false)
  }

  const handleToggleTodo = async (id: string) => {
    setIsLoading(true)
    if (id) {
      await dispatch(toggleTodoCompleted(id))
    }
    await setIsLoading(false)
  }

  const handleDeleteTodo = async (id: string) => {
    setIsLoading(true)
    if (id) {
      await dispatch(deleteTodoAsync(id))
    }
    await setIsLoading(false)
  }

  const handleClearAll = async () => {
    if (selectedDate) {
      await dispatch(deleteAllTodoAsync(new Date(selectedDate)))
    }
  }

  return (
    <>
      <Header pageTitle="Todo List" />
      <div className="flex min-h-[60%] w-full p-4 justify-center">
        <Card className="w-full sm:w-[80%] max-w-2xl">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-2xl sm:text-3xl">Todo List</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Create your tasks and manage them efficiently.
            </CardDescription>
            <div className="relative flex items-center">
              <Input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                placeholder="Add a new task"
                className="pl-4 pr-24 py-6 text-base"
              />
              <Button
                onClick={handleAddTodo}
                className="absolute right-2 px-3 py-5 cursor-pointer"
                size="sm"
              >
                {isLoading ? (
                  <Icons.spinner className="h-5 w-5 animate-spin" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {todos.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No tasks yet. Add your first task!
              </p>
            ) : (
              todos.map((todo: TodoItem) => (
                <div
                  key={todo._id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={todo.todo_completed}
                      className="cursor-pointer"
                      onCheckedChange={() => handleToggleTodo(todo._id)}
                    />
                    <span
                      onClick={() => handleToggleTodo(todo._id)}
                      className={
                        todo.todo_completed
                          ? 'line-through text-muted-foreground cursor-pointer'
                          : 'cursor-pointer '
                      }
                    >
                      {todo.todo_title}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => handleDeleteTodo(todo._id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>

          <CardFooter className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {todos.filter((todo: TodoItem) => !todo.todo_completed).length}{' '}
              items left
            </span>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => setShowConfirm(true)}
            >
              Clear All
            </Button>
          </CardFooter>
        </Card>
        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Clear all tasks?</DialogTitle>
              <DialogDescription>
                This will remove all your todos. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  handleClearAll()
                  setShowConfirm(false)
                }}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
