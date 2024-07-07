import Link from "next/link";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { label: "Product Roadmap", icon: CircuitBoardIcon },
  { label: "Marketing Campaigns", icon: CircuitBoardIcon },
  { label: "Engineering Sprints", icon: CircuitBoardIcon },
  { label: "Content Calendar", icon: LayoutTemplateIcon },
  { label: "Design Sprint", icon: LayoutTemplateIcon },
  { label: "Startup Launch", icon: LayoutTemplateIcon },
];

export function Sidebar({ onSelect }: { onSelect: (category: string) => void }) {
  return (
    <div className="flex flex-col w-64 bg-background">
      <div className="flex h-14 items-center justify-between border-b bg-muted px-4 sm:px-6">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <TrelloIcon className="h-6 w-6" />
          <span className="text-lg font-semibold">Kanban Board</span>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <PlusIcon className="h-5 w-5" />
              <span className="sr-only">Create new</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <CircuitBoardIcon className="mr-2 h-4 w-4" />
              New Board
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LayoutTemplateIcon className="h-6 w-6" />
              New Template
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex-1 overflow-auto">
        <nav className="grid gap-2 p-4 sm:p-6">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => onSelect(item.label)}
              className="flex items-center gap-3 rounded-md bg-muted px-3 py-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

function CircuitBoardIcon(props: any) {
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

function LayoutTemplateIcon(props: any) {
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

function TrelloIcon(props: any) {
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
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <rect width="3" height="9" x="7" y="7" />
      <rect width="3" height="5" x="14" y="7" />
    </svg>
  );
}
