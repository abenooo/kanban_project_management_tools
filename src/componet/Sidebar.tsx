"use client";
import React, { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RxHamburgerMenu } from "react-icons/rx";
import { useDrag, useDrop } from "react-dnd";
import { Separator } from "@/components/ui/separator";
interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface DraggableItemProps {
  item: SidebarItem;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onSelect: (category: string) => void;
  collapsed: boolean;
}

interface SidebarProps {
  onSelect: (category: string) => void;
}

const sidebarItemsData: SidebarItem[] = [
  { id: "1", label: "Personal Tasks", icon: CircuitBoardIcon },
  { id: "2", label: "Marketing Campaign", icon: CircuitBoardIcon },
  { id: "3", label: "Engineering Roadmap", icon: CircuitBoardIcon },
  { id: "4", label: "Design Sprint", icon: LayoutTemplateIcon },
  { id: "5", label: "Sales Pipeline", icon: LayoutTemplateIcon },
];

const DraggableItem: React.FC<DraggableItemProps> = ({ item, index, moveItem, onSelect, collapsed }) => {
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

export function Sidebar({ onSelect }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>(sidebarItemsData);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
    setSidebarItems((prevItems) => {
      const newItems = [...prevItems];
      const [removed] = newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, removed);
      return newItems;
    });
  }, []);

  return (
    <div className={`flex flex-col ${collapsed ? "w-20" : "w-64"} bg-background transition-width duration-300`}>
      <div className="flex h-14 items-center justify-between border-b bg-muted px-4 sm:px-6">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold">
            T
          </div>
          {!collapsed && <span className="text-lg font-semibold">Kanban Board</span>}
        </Link>
        <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleSidebar}>
          <RxHamburgerMenu className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
      <Separator className="my-2" />
      <nav className="flex flex-col gap-2 p-4">
        <div className="text-sm font-medium text-muted-foreground">VIEWS</div>
        <Link href="#" className="flex items-center gap-2 text-sm font-medium hover:bg-muted/50 px-2 py-1 rounded" prefetch={false}>
          <TableIcon className="w-5 h-5" />
          Table
        </Link>
        <Link href="#" className="flex items-center gap-2 text-sm font-medium hover:bg-muted/50 px-2 py-1 rounded" prefetch={false}>
          <CalendarIcon className="w-5 h-5" />
          Calendar
        </Link>
      </nav>
      <Separator className="my-2" />
      <nav className="flex flex-col gap-2 ">
        <div className="text-sm font-medium text-muted-foreground">YOUR BOARDS</div>
        <Link href="#" className="flex items-center gap-2 text-sm font-medium hover:bg-muted/50 px-2 py-1 rounded" prefetch={false}>
          <div className="w-5 h-5" />
          Create New Board
        </Link>
        <div className="flex flex-col gap-2">
          {sidebarItems.map((item, index) => (
            <DraggableItem key={item.id} item={item} index={index} moveItem={moveItem} onSelect={onSelect} collapsed={collapsed} />
          ))}
        </div>
      </nav>
      <div className="flex justify-center p-4">
        <Button  >
          Logout
        </Button>
      </div>
    </div>
  );
}

function CircuitBoardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
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
}

function LayoutTemplateIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
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
}

const TableIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
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

const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
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
const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
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
