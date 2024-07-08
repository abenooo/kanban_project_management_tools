"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Navbar from "./Navbar";
import { Sidebar } from "./Sidebar";

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

type TaskList = {
  [key: string]: Task[];
};

const taskData: { [key: string]: TaskList } = {
  "Product Roadmap": {
    backlog: [
      { id: 1, title: "Roadmap Task 1", description: "Description for task 1." },
      { id: 2, title: "Roadmap Task 2", description: "Description for task 2." },
    ],
    todo: [
      { id: 3, title: "Roadmap Task 3", description: "Description for task 3." },
    ],
    inProgress: [
      { id: 4, title: "Roadmap Task 4", description: "Description for task 4." },
    ],
    done: [
      { id: 5, title: "Roadmap Task 5", description: "Description for task 5." },
    ],
  },
  "Marketing Campaigns": {
    backlog: [
      { id: 6, title: "Marketing Task 1", description: "Description for task 1." },
      { id: 7, title: "Marketing Task 2", description: "Description for task 2." },
    ],
    todo: [
      { id: 8, title: "Marketing Task 3", description: "Description for task 3." },
    ],
    inProgress: [
      { id: 9, title: "Marketing Task 4", description: "Description for task 4." },
    ],
    done: [
      { id: 10, title: "Marketing Task 5", description: "Description for task 5." },
    ],
  },
  "Engineering Sprints": {
    backlog: [
      { id: 11, title: "Sprint Task 1", description: "Description for task 1." },
      { id: 12, title: "Sprint Task 2", description: "Description for task 2." },
    ],
    todo: [
      { id: 13, title: "Sprint Task 3", description: "Description for task 3." },
    ],
    inProgress: [
      { id: 14, title: "Sprint Task 4", description: "Description for task 4." },
    ],
    done: [
      { id: 15, title: "Sprint Task 5", description: "Description for task 5." },
    ],
  },
  "Content Calendar": {
    backlog: [
      { id: 16, title: "Content Task 1", description: "Description for task 1." },
      { id: 17, title: "Content Task 2", description: "Description for task 2." },
    ],
    todo: [
      { id: 18, title: "Content Task 3", description: "Description for task 3." },
    ],
    inProgress: [
      { id: 19, title: "Content Task 4", description: "Description for task 4." },
    ],
    done: [
      { id: 20, title: "Content Task 5", description: "Description for task 5." },
    ],
  },
  "Design Sprint": {
    backlog: [
      { id: 21, title: "Design Task 1", description: "Description for task 1." },
      { id: 22, title: "Design Task 2", description: "Description for task 2." },
    ],
    todo: [
      { id: 23, title: "Design Task 3", description: "Description for task 3." },
    ],
    inProgress: [
      { id: 24, title: "Design Task 4", description: "Description for task 4." },
    ],
    done: [
      { id: 25, title: "Design Task 5", description: "Description for task 5." },
    ],
  },
  "Startup Launch": {
    backlog: [
      { id: 26, title: "Launch Task 1", description: "Description for task 1." },
      { id: 27, title: "Launch Task 2", description: "Description for task 2." },
    ],
    todo: [
      { id: 28, title: "Launch Task 3", description: "Description for task 3." },
    ],
    inProgress: [
      { id: 29, title: "Launch Task 4", description: "Description for task 4." },
    ],
    done: [
      { id: 30, title: "Launch Task 5", description: "Description for task 5." },
    ],
  },
};

export default function Kanban() {
  const [open, setOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [currentCategory, setCurrentCategory] = useState("Product Roadmap");
  const [tasks, setTasks] = useState(taskData[currentCategory]);

  const handleCardClick = (task: Task) => {
    setCurrentTask(task);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentTask(null);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceColumn = tasks[source.droppableId];
    const destColumn = tasks[destination.droppableId];
    const sourceItems = Array.from(sourceColumn);
    const destItems = Array.from(destColumn);
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);

    setTasks({
      ...tasks,
      [source.droppableId]: sourceItems,
      [destination.droppableId]: destItems,
    });
  };

  const handleCategorySelect = (category: string) => {
    setCurrentCategory(category);
    setTasks(taskData[category]);
  };

  const renderCard = (task: Task, index: number) => (
    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-3 rounded-lg shadow-sm mb-4"
          onClick={() => handleCardClick(task)}
        >
          <h3 className="text-sm font-semibold mb-1">{task.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {task.description}
          </p>
        </div>
      )}
    </Draggable>
  );

  return (
    <>
      <Navbar />
      <div className="flex h-screen">
        <Sidebar onSelect={handleCategorySelect} />
        <div className="flex flex-col flex-1">
          <header className="h-[60px] flex items-center px-4 shadow-md">
            <h1 className="text-sm font-medium text-gray-900 dark:text-gray-50 flex items-center">
              <KanbanIcon className="mr-2 h-4 w-4" />
              Kanban Board - {currentCategory}
            </h1>
          </header>
          <main className="flex-1 overflow-auto py-4 px-4 bg-gray-100">
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex space-x-4">
                {Object.entries(tasks).map(([columnId, columnTasks]) => (
                  <Droppable key={columnId} droppableId={columnId}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="w-72"
                      >
                        <h2 className="mb-4 text-sm font-medium text-gray-400 dark:text-gray-300 flex items-center">
                          {columnId.charAt(0).toUpperCase() +
                            columnId.slice(1)}
                        </h2>
                        {columnTasks.map((task, index) =>
                          renderCard(task, index)
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>
          </main>
          {currentTask && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent>
                <DialogHeader>
                  <h3>{currentTask.title}</h3>
                </DialogHeader>
                <div>
                  <div className="mb-4">
                    <Label className="block text-sm font-medium text-gray-700">
                      Title
                    </Label>
                    <Input
                      type="text"
                      className="mt-1 block w-full"
                      defaultValue={currentTask.title}
                    />
                  </div>
                  <div className="mb-4">
                    <Label className="block text-sm font-medium text-gray-700">
                      Status
                    </Label>
                    <Input
                      type="text"
                      className="mt-1 block w-full"
                      defaultValue={currentTask.status}
                    />
                  </div>
                  <div className="mb-4">
                    <Label className="block text-sm font-medium text-gray-700">
                      Members
                    </Label>
                    <Input
                      type="text"
                      className="mt-1 block w-full"
                      defaultValue={currentTask.members}
                    />
                  </div>
                  <div className="mb-4">
                    <Label className="block text-sm font-medium text-gray-700">
                      Labels
                    </Label>
                    <Input
                      type="text"
                      className="mt-1 block w-full"
                      defaultValue={currentTask.labels}
                    />
                  </div>
                  <div className="mb-4">
                    <Label className="block text-sm font-medium text-gray-700">
                      Notifications
                    </Label>
                    <Input
                      type="text"
                      className="mt-1 block w-full"
                      defaultValue={currentTask.notifications}
                    />
                  </div>
                  <div className="mb-4">
                    <Label className="block text-sm font-medium text-gray-700">
                      Date
                    </Label>
                    <Input
                      type="text"
                      className="mt-1 block w-full"
                      defaultValue={currentTask.date}
                    />
                  </div>
                  <div className="mb-4">
                    <Label className="block text-sm font-medium text-gray-700">
                      Description
                    </Label>
                    <Textarea
                      className="mt-1 block w-full"
                      defaultValue={currentTask.description}
                      rows={4}
                    ></Textarea>
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
      </div>
    </>
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
