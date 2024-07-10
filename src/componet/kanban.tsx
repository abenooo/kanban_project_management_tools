"use client";
import React, { useState, useRef, useEffect } from "react";
import { DndProvider, useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "@/components/ui/button";
import { RxHamburgerMenu } from "react-icons/rx";
import Navbar from "./Navbar";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { FaUsers, FaCog, FaEye } from "react-icons/fa"; //
const CARD_TYPE = "CARD";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

interface TaskList {
  [key: string]: Task[];
}

interface TaskData {
  [key: string]: TaskList;
}

const initialTaskData: TaskData = {
  "Product Roadmap": {
    backlog: [
      {
        id: 1,
        title: "Roadmap Task 1",
        description: "Description for task 1.",
        status: "backlog",
      },
      {
        id: 2,
        title: "Roadmap Task 2",
        description: "Description for task 2.",
        status: "backlog",
      },
    ],
    todo: [
      {
        id: 3,
        title: "Roadmap Task 3",
        description: "Description for task 3.",
        status: "todo",
      },
    ],
    inProgress: [
      {
        id: 4,
        title: "Roadmap Task 4",
        description: "Description for task 4.",
        status: "inProgress",
      },
    ],
    done: [
      {
        id: 5,
        title: "Roadmap Task 5",
        description: "Description for task 5.",
        status: "done",
      },
    ],
  },
  "Marketing Campaigns": {
    backlog: [
      {
        id: 6,
        title: "Marketing Task 1",
        description: "Description for task 1.",
        status: "backlog",
      },
      {
        id: 7,
        title: "Marketing Task 2",
        description: "Description for task 2.",
        status: "backlog",
      },
    ],
    todo: [
      {
        id: 8,
        title: "Marketing Task 3",
        description: "Description for task 3.",
        status: "todo",
      },
    ],
    inProgress: [
      {
        id: 9,
        title: "Marketing Task 4",
        description: "Description for task 4.",
        status: "inProgress",
      },
    ],
    done: [
      {
        id: 10,
        title: "Marketing Task 5",
        description: "Description for task 5.",
        status: "done",
      },
    ],
  },
  "Engineering Sprints": {
    backlog: [
      {
        id: 11,
        title: "Engineering Task 1",
        description: "Description for task 1.",
        status: "backlog",
      },
      {
        id: 12,
        title: "Engineering Task 2",
        description: "Description for task 2.",
        status: "backlog",
      },
    ],
    todo: [
      {
        id: 13,
        title: "Engineering Task 3",
        description: "Description for task 3.",
        status: "todo",
      },
    ],
    inProgress: [
      {
        id: 14,
        title: "Engineering Task 4",
        description: "Description for task 4.",
        status: "inProgress",
      },
    ],
    done: [
      {
        id: 15,
        title: "Engineering Task 5",
        description: "Description for task 5.",
        status: "done",
      },
    ],
  },
  "Content Calendar": {
    backlog: [
      {
        id: 16,
        title: "Content Task 1",
        description: "Description for task 1.",
        status: "backlog",
      },
      {
        id: 17,
        title: "Content Task 2",
        description: "Description for task 2.",
        status: "backlog",
      },
    ],
    todo: [
      {
        id: 18,
        title: "Content Task 3",
        description: "Description for task 3.",
        status: "todo",
      },
    ],
    inProgress: [
      {
        id: 19,
        title: "Content Task 4",
        description: "Description for task 4.",
        status: "inProgress",
      },
    ],
    done: [
      {
        id: 20,
        title: "Content Task 5",
        description: "Description for task 5.",
        status: "done",
      },
    ],
  },
  "Design Sprint": {
    backlog: [
      {
        id: 21,
        title: "Design Task 1",
        description: "Description for task 1.",
        status: "backlog",
      },
      {
        id: 22,
        title: "Design Task 2",
        description: "Description for task 2.",
        status: "backlog",
      },
    ],
    todo: [
      {
        id: 23,
        title: "Design Task 3",
        description: "Description for task 3.",
        status: "todo",
      },
    ],
    inProgress: [
      {
        id: 24,
        title: "Design Task 4",
        description: "Description for task 4.",
        status: "inProgress",
      },
    ],
    done: [
      {
        id: 25,
        title: "Design Task 5",
        description: "Description for task 5.",
        status: "done",
      },
    ],
  },
  "Startup Launch": {
    backlog: [
      {
        id: 26,
        title: "Startup Task 1",
        description: "Description for task 1.",
        status: "backlog",
      },
      {
        id: 27,
        title: "Startup Task 2",
        description: "Description for task 2.",
        status: "backlog",
      },
    ],
    todo: [
      {
        id: 28,
        title: "Startup Task 3",
        description: "Description for task 3.",
        status: "todo",
      },
    ],
    inProgress: [
      {
        id: 29,
        title: "Startup Task 4",
        description: "Description for task 4.",
        status: "inProgress",
      },
    ],
    done: [
      {
        id: 30,
        title: "Startup Task 5",
        description: "Description for task 5.",
        status: "done",
      },
    ],
  },
};

interface DraggableCardProps {
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
  onCardClick: (task: Task) => void;
}

const DraggableCard: React.FC<DraggableCardProps> = ({
  task,
  index,
  moveCard,
  columnId,
  categoryId,
  onCardClick,
}) => {
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
    hover: (
      draggedItem: {
        id: number;
        index: number;
        columnId: string;
        categoryId: string;
      },
      monitor: DropTargetMonitor
    ) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (
        dragIndex === hoverIndex &&
        draggedItem.columnId === columnId &&
        draggedItem.categoryId === categoryId
      ) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
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
      className={`bg-white p-3 rounded-lg shadow-sm mb-4 dark:bg-gray-800 dark:text-white cursor-move transition-transform duration-200 ${
        isDragging ? "opacity-50" : ""
      }`}
      onClick={() => onCardClick(task)}
    >
      <h3 className="text-sm font-semibold mb-1">{task.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {task.description}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-500">
        Status: {task.status}
      </p>
    </div>
  );
};

interface DroppableColumnProps {
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
  onCardClick: (task: Task) => void;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({
  columnId,
  tasks,
  moveCard,
  categoryId,
  onCardClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: CARD_TYPE,
    drop: (item: {
      id: number;
      index: number;
      columnId: string;
      categoryId: string;
    }) => {
      if (item.columnId !== columnId || item.categoryId !== categoryId) {
        moveCard(
          item.index,
          tasks.length,
          item.columnId,
          columnId,
          item.categoryId,
          categoryId
        );
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
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
};

const Kanban: React.FC = () => {
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [currentCategory, setCurrentCategory] =
    useState<string>("Product Roadmap");
  const [taskData, setTaskData] = useState<TaskData>(initialTaskData);

  const handleCardClick = (task: Task) => {
    setCurrentTask(task);
  };

  const handleCloseDetails = () => {
    setCurrentTask(null);
  };

  const handleCategorySelect = (category: string) => {
    setCurrentTask(null);
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

  const validCategory = taskData[currentCategory]
    ? currentCategory
    : Object.keys(taskData)[0];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen dark:bg-gray-900">
        <Sidebar onSelect={handleCategorySelect} />
        <div className="flex flex-col flex-1">
          <header className="h-[60px] flex items-center px-4 shadow-md dark:bg-gray-800">
            <h1 className="text-sm font-medium text-gray-900 dark:text-gray-50 flex items-center whitespace-nowrap">
              {/* <KanbanIcon className="mr-2 h-4 w-4" /> */}
              Kanban Board - {validCategory}
              <Navbar />
            </h1>
          </header>
          <main className="flex-1 overflow-auto py-4 px-4 bg-gray-100 dark:bg-gray-900">
            {currentTask ? (
              <>
                <Button onClick={handleCloseDetails} className="mb-4">
                  Back to Task List 555
                </Button>
                <TaskDetailsComponent
                  task={currentTask}
                  onBack={handleCloseDetails}
                />{" "}
                {/* Pass onBack prop */}
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
};

interface SidebarItemProps {
  item: SidebarItemType;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onSelect: (category: string) => void;
  collapsed: boolean;
}

interface SidebarItemType {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  index,
  moveItem,
  onSelect,
  collapsed,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag({
    type: "SIDEBAR_ITEM",
    item: { id: item.id, index },
  });

  const [, drop] = useDrop({
    accept: "SIDEBAR_ITEM",
    hover: (draggedItem: { id: string; index: number }) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className="flex items-center gap-3 rounded-md bg-muted px-3 py-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground cursor-move"
      onClick={() => onSelect(item.label)}
    >
      <item.icon className="h-6 w-6 md:h-8 md:w-8" />
      {!collapsed && <span className="sidebar-item-label">{item.label}</span>}
    </div>
  );
};

interface SidebarProps {
  onSelect: (category: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarItems, setSidebarItems] = useState<SidebarItemType[]>([
    { id: "1", label: "Product Roadmap", icon: PlusIcon },
    { id: "2", label: "Marketing Campaigns", icon: CircuitBoardIcon },
    { id: "3", label: "Engineering Sprints", icon: PlusIcon },
    { id: "4", label: "Content Calendar", icon: LayoutTemplateIcon },
    { id: "5", label: "Design Sprint", icon: PlusIcon },
    { id: "6", label: "Startup Launch", icon: LayoutTemplateIcon },
  ]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    setSidebarItems((prevItems) => {
      const newItems = [...prevItems];
      const [removed] = newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, removed);
      return newItems;
    });
  };

  return (
    <div
      className={`flex flex-col ${
        collapsed ? "w-20" : "w-64"
      } bg-background transition-width duration-300`}
    >
      <div className="flex h-14 items-center justify-between border-b bg-muted px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {!collapsed && (
            <span className="text-lg font-semibold">CodeX Ethiopia</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={toggleSidebar}
        >
          <RxHamburgerMenu className="h-6 w-6" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        <div>
          <nav className="flex flex-col gap-2 p-4 ">
            <div className="text-sm font-medium text-muted-foreground">
              WORKSPACE
            </div>
            <Link
              href="#"
              className="flex items-center gap-2 text-sm text-sm font-medium text-muted-foreground px-2 py-1 rounded"
              prefetch={false}
            >
              <FaUsers className="w-5 h-5" /> {/* Icon for Members */}
              Members
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 text-sm text-sm font-medium text-muted-foreground px-2 py-1 rounded"
              prefetch={false}
            >
              <FaCog className="w-5 h-5" /> {/* Icon for Workspace Settings */}
              Workspace Settings
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 text-sm text-sm font-medium text-muted-foreground px-2 py-1 rounded"
              prefetch={false}
            >
              <FaEye className="w-5 h-5" /> {/* Icon for Workspace Views */}
              Workspace Views
            </Link>
          </nav>
          <Separator className="my-2" />
          <nav className="flex items-center justify-between p-4">
            <div className="text-sm font-medium text-muted-foreground">
              YOUR BOARDS 
            </div>
            <PlusIcon className="h-5 w-5" />
          </nav>
        </div>
        <div
          className={`grid gap-2 p-4 sm:p-6 text-sm font-medium text-muted-foreground ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {sidebarItems.map((item, index) => (
            <SidebarItem
              key={item.id}
              item={item}
              index={index}
              moveItem={moveItem}
              onSelect={onSelect}
              collapsed={collapsed}
            />
          ))}
        </div>
        <div className="flex justify-center  p-4 bg-gray-200 mx-6  rounded-md">
          <Button variant="ghost" size="sm">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

const CircuitBoardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 md:w-8 md:h-8"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M11 9h4a2 2 0 0 0 2-2V3" />
    <circle cx="9" cy="9" r="2" />
    <path d="M7 21v-4a2 2 0 0 1 2-2h4" />
    <circle cx="15" cy="15" r="2" />
  </svg>
);

const LayoutTemplateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 md:w-8 md:h-8"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="7" x="3" y="3" rx="1" />
    <rect width="9" height="7" x="3" y="14" rx="1" />
    <rect width="5" height="7" x="16" y="14" rx="1" />
  </svg>
);

const KanbanIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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

interface TaskDetailsComponentProps {
  task: Task;
  onBack: () => void;
}

const TaskDetailsComponent: React.FC<TaskDetailsComponentProps> = ({
  task,
  onBack,
}) => (
  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h2 className="text-xl font-bold mb-4">{task.title}</h2>
    <p className="text-gray-700 dark:text-gray-300 mb-4">{task.description}</p>
    <Button onClick={onBack}>Back</Button>
  </div>
);

export default Kanban;

function PlusIcon(props: any) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
