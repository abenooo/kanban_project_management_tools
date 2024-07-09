"use client";
import React, { useState, useRef, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Navbar from "./Navbar";
import { Sidebar } from "./Sidebar";
import TaskDetailsComponent from "./TaskDetailsComponent"; // Import TaskDetailsComponent
import { Button } from "@/components/ui/button";

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
  // Other categories remain unchanged
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
  onCardClick: (task: Task) => void; // Add onCardClick prop
}> = ({ task, index, moveCard, columnId, categoryId, onCardClick }) => {
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
      onClick={() => onCardClick(task)} // Add onClick handler
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
  onCardClick: (task: Task) => void; // Add onCardClick prop
}> = ({ columnId, tasks, moveCard, categoryId, onCardClick }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: CARD_TYPE,
    drop: (item: { id: number; index: number; columnId: string; categoryId: string }) => {
      if (item.columnId !== columnId || item.categoryId !== categoryId) {
        moveCard(item.index, tasks.length, item.columnId, columnId, item.categoryId, categoryId);
      }
    },
  });

  useEffect(() => {
    if (ref.current) {
      drop(ref);
    }
  }, [drop]);

  return (
    <div ref={ref} className="w-72 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg">
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
          onCardClick={onCardClick} // Pass onCardClick prop
        />
      ))}
    </div>
  );
};

export default function Kanban() {
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [currentCategory, setCurrentCategory] = useState("Product Roadmap");
  const [taskData, setTaskData] = useState<TaskData>(initialTaskData);

  const handleCardClick = (task: Task) => {
    setCurrentTask(task);
  };

  const handleCloseDetails = () => {
    setCurrentTask(null);
  };

  const handleCategorySelect = (category: string) => {
    setCurrentTask(null); // Close the task details when a new category is selected
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
            {currentTask ? (
              <>
                <Button onClick={handleCloseDetails} className="mb-4">
                  Back to Task List
                </Button>
                <TaskDetailsComponent task={currentTask} onBack={handleCloseDetails} /> {/* Pass onBack prop */}
              </>
            ) : (
              <div className="flex space-x-4">
                {Object.entries(taskData[validCategory] || {}).map(
                  ([columnId, columnTasks]) => (
                    <DroppableColumn
                      key={columnId}
                      columnId={columnId}
                      tasks={columnTasks}
                      moveCard={moveCard}
                      categoryId={validCategory}
                      onCardClick={handleCardClick} // Pass handleCardClick to DroppableColumn
                    />
                  )
                )}
              </div>
            )}
          </main>
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
