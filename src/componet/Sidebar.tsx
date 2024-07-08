"use client";
import React, { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RxHamburgerMenu } from "react-icons/rx";
import { useDrag, useDrop } from "react-dnd";

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
}

interface SidebarProps {
  onSelect: (category: string) => void;
}

const sidebarItemsData: SidebarItem[] = [
  { id: "1", label: "Product Roadmap", icon: CircuitBoardIcon },
  { id: "2", label: "Marketing Campaigns", icon: CircuitBoardIcon },
  { id: "3", label: "Engineering Sprints", icon: CircuitBoardIcon },
  { id: "4", label: "Content Calendar", icon: LayoutTemplateIcon },
  { id: "5", label: "Design Sprint", icon: LayoutTemplateIcon },
  { id: "6", label: "Startup Launch", icon: LayoutTemplateIcon },
];

const DraggableItem: React.FC<DraggableItemProps> = ({ item, index, moveItem, onSelect }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag({
    type: 'SIDEBAR_ITEM',
    item: { id: item.id, index },
  });

  const [, drop] = useDrop({
    accept: 'SIDEBAR_ITEM',
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
      <item.icon className="h-5 w-5" />
      <span>{item.label}</span>
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
          {!collapsed && <span className="text-lg font-semibold">Kanban Board</span>}
        </Link>
        <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleSidebar}>
          <RxHamburgerMenu className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="grid gap-2 p-4 sm:p-6">
          {sidebarItems.map((item, index) => (
            <DraggableItem
              key={item.id}
              item={item}
              index={index}
              moveItem={moveItem}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CircuitBoardIcon(props: React.SVGProps<SVGSVGElement>) {
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
      width="24"
      height="24"
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
