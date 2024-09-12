'use client'

import { useRecoilState } from 'recoil'
import { tasksState, Status, Task } from '@/lib/atoms'
import TaskComponent from './task'
import { useMemo } from 'react'

export default function Column({
  title,
  status
}: {
  title: string
  status: Status
}) {
  const [tasks, setTasks] = useRecoilState(tasksState)

  const filteredTasks = useMemo(
    () => tasks.filter((task: Task) => task.status === status),
    [tasks, status]
  )

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const data = JSON.parse(e.dataTransfer.getData('text/plain')) as { id: string }
    const draggedTask = tasks.find((task: Task) => task.id === data.id)
    
    if (draggedTask && draggedTask.status !== status) {
      const newTasks = tasks.map((task: Task) =>
        task.id === data.id ? { ...task, status } : task
      )
      setTasks(newTasks)
    } else if (status === 'DONE' && e.target === e.currentTarget) {
      const newTasks = [...tasks]
      const draggedTaskIndex = newTasks.findIndex((task: Task) => task.id === data.id)
      if (draggedTaskIndex !== -1) {
        const [draggedTask] = newTasks.splice(draggedTaskIndex, 1)
        newTasks.push(draggedTask)
        setTasks(newTasks)
      }
    }
  }

  return (
    <section className='h-[600px] flex-1'>
      <h2 className='ml-1 font-serif text-2xl font-semibold'>{title}</h2>

      <div
        className='mt-3.5 h-full w-full rounded-xl bg-gray-700/50 p-4'
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className='flex flex-col gap-4'>
          {filteredTasks.map((task: Task, index: number) => (
            <TaskComponent key={task.id} {...task} index={index} />
          ))}

          {filteredTasks.length === 0 && status === 'TODO' && (
            <div className='mt-8 text-center text-sm text-gray-500'>
              <p>Create a new task</p>
            </div>
          )}

          {tasks.length > 0 && filteredTasks.length === 0 && status !== 'TODO' && (
            <div className='mt-8 text-center text-sm text-gray-500'>
              <p>Drag your tasks here</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
