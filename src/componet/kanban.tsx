"use client";
import React, { useState, useRef, useCallback } from "react";
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
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Navbar from "./Navbar";
import { Sidebar } from "./Sidebar";

const CARD_TYPE = "CARD";

type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
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
      { id: 1, title: "Roadmap Task 1", description: "Description for task 1.", status: "backlog" },
      { id: 2, title: "Roadmap Task 2", description: "Description for task 2.", status: "backlog" },
    ],
    todo: [
      { id: 3, title: "Roadmap Task 3", description: "Description for task 3.", status: "todo" },
    ],
    inProgress: [
      { id: 4, title: "Roadmap Task 4", description: "Description for task 4.", status: "inProgress" },
    ],
    done: [
      { id: 5, title: "Roadmap Task 5", description: "Description for task 5.", status: "done" },
    ],
  },
  "Marketing Campaigns": {
    backlog: [
      { id: 6, title: "Marketing Task 1", description: "Description for task 1.", status: "backlog" },
      { id: 7, title: "Marketing Task 2", description: "Description for task 2.", status: "backlog" },
    ],
    todo: [
      { id: 8, title: "Marketing Task 3", description: "Description for task 3.", status: "todo" },
    ],
    inProgress: [
      { id: 9, title: "Marketing Task 4", description: "Description for task 4.", status: "inProgress" },
    ],
    done: [
      { id: 10, title: "Marketing Task 5", description: "Description for task 5.", status: "done" },
    ],
  },
  // ... other categories
};

const DraggableCard: React.FC<{ task: Task, index: number, moveCard: (dragIndex: number, hoverIndex: number, sourceColumn: string, destColumn: string) => void, columnId: string }> = ({ task, index, moveCard, columnId }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag({
    type: CARD_TYPE,
    item: { id: task.id, index, columnId },
  });

  const [, drop] = useDrop({
    accept: CARD_TYPE,
    hover: (draggedItem: { id: number; index: number; columnId: string }) => {
      if (draggedItem.index !== index || draggedItem.columnId !== columnId) {
        moveCard(draggedItem.index, index, draggedItem.columnId, columnId);
        draggedItem.index = index;
        draggedItem.columnId = columnId;
      }
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className="bg-white p-3 rounded-lg shadow-sm mb-4 dark:bg-gray-800 dark:text-white cursor-move"
    >
      <h3 className="text-sm font-semibold mb-1">{task.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
      <p className="text-xs text-gray-500 dark:text-gray-500">Status: {task.status}</p>
    </div>
  );
};

const DroppableColumn: React.FC<{ columnId: string, tasks: Task[], moveCard: (dragIndex: number, hoverIndex: number, sourceColumn: string, destColumn: string) => void }> = ({ columnId, tasks, moveCard }) => {
  const [, drop] = useDrop({
    accept: CARD_TYPE,
    hover: () => { },
  });

  return (
    <div ref={(instance) => drop(instance)} className="w-72 p-4">
      <h2 className="mb-4 text-sm font-medium text-gray-400 dark:text-gray-300 flex items-center">
        {columnId.charAt(0).toUpperCase() + columnId.slice(1)}
      </h2>
      {tasks.map((task, index) => (
        <DraggableCard key={task.id} task={task} index={index} moveCard={moveCard} columnId={columnId} />
      ))}
    </div>
  );
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

  const handleCategorySelect = (category: string) => {
    setCurrentCategory(category);
    setTasks(taskData[category]);
  };

  const moveCard = (dragIndex: number, hoverIndex: number, sourceColumn: string, destColumn: string) => {
    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };
      const sourceItems = [...newTasks[sourceColumn]];
      const [draggedItem] = sourceItems.splice(dragIndex, 1);

      // Update the status of the dragged item
      draggedItem.status = destColumn;

      if (sourceColumn === destColumn) {
        sourceItems.splice(hoverIndex, 0, draggedItem);
        newTasks[sourceColumn] = sourceItems;
      } else {
        const destItems = [...newTasks[destColumn]];
        destItems.splice(hoverIndex, 0, draggedItem);
        newTasks[destColumn] = destItems;
        newTasks[sourceColumn] = sourceItems; // Ensure the source column is updated
      }

      return newTasks;
    });
  };

  return (
    <>
      <Navbar />
      <div className="flex h-screen dark:bg-gray-900"> {/* Add dark mode class */}
        <Sidebar onSelect={handleCategorySelect} />
        <div className="flex flex-col flex-1">
          <header className="h-[60px] flex items-center px-4 shadow-md dark:bg-gray-800"> {/* Add dark mode class */}
            <h1 className="text-sm font-medium text-gray-900 dark:text-gray-50 flex items-center">
              <KanbanIcon className="mr-2 h-4 w-4" />
              Kanban Board - {currentCategory}
            </h1>
          </header>
          <main className="flex-1 overflow-auto py-4 px-4 bg-gray-100 dark:bg-gray-900"> {/* Add dark mode class */}
            <DndProvider backend={HTML5Backend}>
              <div className="flex space-x-4">
                {Object.entries(tasks).map(([columnId, columnTasks]) => (
                  <DroppableColumn
                    key={columnId}
                    columnId={columnId}
                    tasks={columnTasks}
                    moveCard={moveCard}
                  />
                ))}
              </div>
            </DndProvider>
          </main>
          {currentTask && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent>
                <DialogHeader>
                  <h3>{currentTask.title}</h3>
                </DialogHeader>
                <div>
                  <div className="mb-4">
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Title
                    </Label>
                    <Input
                      type="text"
                      className="mt-1 block w-full"
                      defaultValue={currentTask.title}
                    />
                  </div>
                  <div className="mb-4">
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </Label>
                    <Input
                      type="text"
                      className="mt-1 block w-full"
                      defaultValue={currentTask.status}
                    />
                  </div>
                  <div className="mb-4">
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Members
                    </Label>
                    <Input
                      type="text"
                      className="mt-1 block w-full"
                      defaultValue={currentTask.members}
                    />
                  </div>
                  <div className="mb-4">
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Labels
                    </Label>
                    <Input
                      type="text"
                      className="mt-1 block w-full"
                      defaultValue={currentTask.labels}
                    />
                  </div>
                  <div className="mb-4">
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Notifications
                    </Label>
                    <Input
                      type="text"
                      className="mt-1 block w-full"
                      defaultValue={currentTask.notifications}
                    />
                  </div>
                  <div className="mb-4">
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date
                    </Label>
                    <Input
                      type="text"
                      className="mt-1 block w-full"
                      defaultValue={currentTask.date}
                    />
                  </div>
                  <div className="mb-4">
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
