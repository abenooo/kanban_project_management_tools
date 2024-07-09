"use client";
import React, { useState, useRef } from "react";
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

type TaskData = {
  [key: string]: TaskList;
};

const initialTaskData: TaskData = {
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
  "Engineering Sprints": {
    backlog: [
      { id: 11, title: "Sprint Task 1", description: "Description for task 1.", status: "backlog" },
      { id: 12, title: "Sprint Task 2", description: "Description for task 2.", status: "backlog" },
    ],
    todo: [
      { id: 13, title: "Sprint Task 3", description: "Description for task 3.", status: "todo" },
    ],
    inProgress: [
      { id: 14, title: "Sprint Task 4", description: "Description for task 4.", status: "inProgress" },
    ],
    done: [
      { id: 15, title: "Sprint Task 5", description: "Description for task 5.", status: "done" },
    ],
  },
  "Content Calendar": {
    backlog: [
      { id: 16, title: "Content Task 1", description: "Description for task 1.", status: "backlog" },
      { id: 17, title: "Content Task 2", description: "Description for task 2.", status: "backlog" },
    ],
    todo: [
      { id: 18, title: "Content Task 3", description: "Description for task 3.", status: "todo" },
    ],
    inProgress: [
      { id: 19, title: "Content Task 4", description: "Description for task 4.", status: "inProgress" },
    ],
    done: [
      { id: 20, title: "Content Task 5", description: "Description for task 5.", status: "done" },
    ],
  },
  "Design Sprint": {
    backlog: [
      { id: 21, title: "Design Task 1", description: "Description for task 1.", status: "backlog" },
      { id: 22, title: "Design Task 2", description: "Description for task 2.", status: "backlog" },
    ],
    todo: [
      { id: 23, title: "Design Task 3", description: "Description for task 3.", status: "todo" },
    ],
    inProgress: [
      { id: 24, title: "Design Task 4", description: "Description for task 4.", status: "inProgress" },
    ],
    done: [
      { id: 25, title: "Design Task 5", description: "Description for task 5.", status: "done" },
    ],
  },
  "Startup Launch": {
    backlog: [
      { id: 26, title: "Launch Task 1", description: "Description for task 1.", status: "backlog" },
      { id: 27, title: "Launch Task 2", description: "Description for task 2.", status: "backlog" },
    ],
    todo: [
      { id: 28, title: "Launch Task 3", description: "Description for task 3.", status: "todo" },
    ],
    inProgress: [
      { id: 29, title: "Launch Task 4", description: "Description for task 4.", status: "inProgress" },
    ],
    done: [
      { id: 30, title: "Launch Task 5", description: "Description for task 5.", status: "done" },
    ],
  },
};

const DraggableCard: React.FC<{
  task: Task;
  index: number;
  moveCard: (
    dragIndex: number,
    hoverIndex: number,
    sourceColumn: string,
    destColumn: string,
    sourceCategory: string,
    destCategory: string
  ) => void;
  columnId: string;
  categoryId: string;
}> = ({ task, index, moveCard, columnId, categoryId }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: CARD_TYPE,
    item: { id: task.id, index, columnId, categoryId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: CARD_TYPE,
    hover: (draggedItem: {
      id: number;
      index: number;
      columnId: string;
      categoryId: string;
    }, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex && draggedItem.columnId === columnId && draggedItem.categoryId === categoryId) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveCard(
        dragIndex,
        hoverIndex,
        draggedItem.columnId,
        columnId,
        draggedItem.categoryId,
        categoryId
      );

      draggedItem.index = hoverIndex;
      draggedItem.columnId = columnId;
      draggedItem.categoryId = categoryId;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`bg-white p-3 rounded-lg shadow-sm mb-4 dark:bg-gray-800 dark:text-white cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <h3 className="text-sm font-semibold mb-1">{task.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
      <p className="text-xs text-gray-500 dark:text-gray-500">Status: {task.status}</p>
    </div>
  );
};

const DroppableColumn: React.FC<{
  columnId: string;
  tasks: Task[];
  moveCard: (
    dragIndex: number,
    hoverIndex: number,
    sourceColumn: string,
    destColumn: string,
    sourceCategory: string,
    destCategory: string
  ) => void;
  categoryId: string;
}> = ({ columnId, tasks, moveCard, categoryId }) => {
  const [, drop] = useDrop({
    accept: CARD_TYPE,
    drop: (item: { id: number; index: number; columnId: string; categoryId: string }) => {
      if (item.columnId !== columnId || item.categoryId !== categoryId) {
        moveCard(item.index, tasks.length, item.columnId, columnId, item.categoryId, categoryId);
      }
    },
  });

  return (
    <div ref={drop} className="w-72 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg">
      <h2 className="mb-4 text-sm font-medium text-gray-400 dark:text-gray-300 flex items-center">
        {columnId.charAt(0).toUpperCase() + columnId.slice(1)}
      </h2>
      {tasks.map((task, index) => (
        <DraggableCard
          key={task.id}
          task={task}
          index={index}
          moveCard={moveCard}
          columnId={columnId}
          categoryId={categoryId}
        />
      ))}
    </div>
  );
};

export default function Kanban() {
  const [open, setOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [currentCategory, setCurrentCategory] = useState("Product Roadmap");
  const [taskData, setTaskData] = useState<TaskData>(initialTaskData);

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
  };

  const moveCard = (
    dragIndex: number,
    hoverIndex: number,
    sourceColumn: string,
    destColumn: string,
    sourceCategory: string,
    destCategory: string
  ) => {
    setTaskData((prevTaskData) => {
      const newTaskData = { ...prevTaskData };

      const sourceItems = [...newTaskData[sourceCategory][sourceColumn]];
      const [draggedItem] = sourceItems.splice(dragIndex, 1);

      if (draggedItem) {
        draggedItem.status = destColumn;

        if (sourceCategory === destCategory && sourceColumn === destColumn) {
          sourceItems.splice(hoverIndex, 0, draggedItem);
          newTaskData[sourceCategory][sourceColumn] = sourceItems;
        } else {
          newTaskData[sourceCategory][sourceColumn] = sourceItems;

          const destItems = [...newTaskData[destCategory][destColumn]];
          destItems.splice(hoverIndex, 0, draggedItem);
          newTaskData[destCategory][destColumn] = destItems;
        }
      }

      return newTaskData;
    });
  };

  // Check if the currentCategory exists in taskData
  const validCategory = taskData[currentCategory] ? currentCategory : Object.keys(taskData)[0];

  return (
    <DndProvider backend={HTML5Backend}>
      <Navbar />
      <div className="flex h-screen dark:bg-gray-900">
        <Sidebar onSelect={handleCategorySelect} />
        <div className="flex flex-col flex-1">
          <header className="h-[60px] flex items-center px-4 shadow-md dark:bg-gray-800">
            <h1 className="text-sm font-medium text-gray-900 dark:text-gray-50 flex items-center">
              <KanbanIcon className="mr-2 h-4 w-4" />
              Kanban Board - {validCategory}
            </h1>
          </header>
          <main className="flex-1 overflow-auto py-4 px-4 bg-gray-100 dark:bg-gray-900">
            <div className="flex space-x-4">
              {Object.entries(taskData[validCategory]).map(
                ([columnId, columnTasks]) => (
                  <DroppableColumn
                    key={columnId}
                    columnId={columnId}
                    tasks={columnTasks}
                    moveCard={moveCard}
                    categoryId={validCategory}
                  />
                )
              )}
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
    </DndProvider>
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
