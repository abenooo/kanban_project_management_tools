"use client"
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter,  } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type Task = {
  id: number;
  title: string;
  description: string;
  status?: string;
  members?: string;
  labels?: string;
  notifications?: string;
  date?: string;
};

export default function Kanban() {
  const [open, setOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  const handleCardClick = (task: Task) => {
    setCurrentTask(task);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentTask(null);
  };

  const renderCard = (task: Task) => (
    <div key={task.id} className="bg-white p-3 rounded-lg shadow-sm mb-4" onClick={() => handleCardClick(task)}>
      <h3 className="text-sm font-semibold mb-1">{task.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
    </div>
  );

  const tasks = {
    backlog: [
      { id: 1, title: 'Task 1', description: 'This is a description for task 1.' },
      { id: 2, title: 'Task 2', description: 'This is a description for task 2.' },
      { id: 3, title: 'Task 3', description: 'This is a description for task 3.' },
    ],
    todo: [
      { id: 4, title: 'Task 4', description: 'This is a description for task 4.' },
      { id: 5, title: 'Task 5', description: 'This is a description for task 5.' },
    ],
    inProgress: [
      { id: 6, title: 'Task 6', description: 'This is a description for task 6.' },
      { id: 7, title: 'Task 7', description: 'This is a description for task 7.' },
    ],
    done: [
      { id: 8, title: 'Task 8', description: 'This is a description for task 8.' },
      { id: 9, title: 'Task 9', description: 'This is a description for task 9.' },
    ],
  };

  return (
    <div key="1" className="flex flex-col h-screen">
      <header className="h-[60px] flex items-center px-4 shadow-md">
        <h1 className="text-sm font-medium text-gray-900 dark:text-gray-50 flex items-center">
          <KanbanIcon className="mr-2 h-4 w-4" />
          Kanban Board
        </h1>
      </header>
      <main className="flex-1 overflow-auto py-4 px-4 bg-gray-100">
        <div className="flex space-x-4">
          <div className="w-72">
            <h2 className="mb-4 text-sm font-medium text-gray-400 dark:text-gray-300 flex items-center">
              <BackpackIcon className="mr-2 h-4 w-4" />
              Backlog
            </h2>
            {tasks.backlog.map(renderCard)}
          </div>
          <div className="w-72">
            <h2 className="mb-4 text-sm font-medium text-gray-400 dark:text-gray-300 flex items-center">
              <ListTodoIcon className="mr-2 h-4 w-4" />
              To Do
            </h2>
            {tasks.todo.map(renderCard)}
          </div>
          <div className="w-72">
            <h2 className="mb-4 text-sm font-medium text-gray-400 dark:text-gray-300 flex items-center">
              <ActivityIcon className="mr-2 h-4 w-4" />
              In Progress
            </h2>
            {tasks.inProgress.map(renderCard)}
          </div>
          <div className="w-72">
            <h2 className="mb-4 text-sm font-medium text-gray-400 dark:text-gray-300 flex items-center">
              <CheckIcon className="mr-2 h-4 w-4" />
              Done
            </h2>
            {tasks.done.map(renderCard)}
          </div>
        </div>
      </main>
      {currentTask && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <h3>{currentTask.title}</h3>
            </DialogHeader>
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" className="mt-1 block w-full" defaultValue={currentTask.title} />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <input type="text" className="mt-1 block w-full" defaultValue={currentTask.status} />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Members</label>
                <input type="text" className="mt-1 block w-full" defaultValue={currentTask.members} />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Labels</label>
                <input type="text" className="mt-1 block w-full" defaultValue={currentTask.labels} />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Notifications</label>
                <input type="text" className="mt-1 block w-full" defaultValue={currentTask.notifications} />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input type="text" className="mt-1 block w-full" defaultValue={currentTask.date} />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea className="mt-1 block w-full" defaultValue={currentTask.description} rows={4}></textarea>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleClose} color="primary">
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function ActivityIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
    </svg>
  );
}

function BackpackIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5" />
      <path d="M8 10h8" />
      <path d="M8 18h8" />
    </svg>
  );
}

function CheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function KanbanIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 5v11" />
      <path d="M12 5v6" />
      <path d="M18 5v14" />
    </svg>
  );
}

function ListTodoIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="6" height="6" rx="1" />
      <path d="m3 17 2 2 4-4" />
      <path d="M13 6h8" />
      <path d="M13 12h8" />
      <path d="M13 18h8" />
    </svg>
  );
}
