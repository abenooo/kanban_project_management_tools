"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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

type TaskDetailsComponentProps = {
  task: Task;
  onBack: () => void; // Add onBack prop
};

export default function TaskDetailsComponent({ task, onBack }: TaskDetailsComponentProps) {
  return (
    <div>
      <Button onClick={onBack} className="mb-4">Back to Task List</Button>
      <div className="grid md:grid-cols-[1fr_400px] gap-8 max-w-6xl mx-auto py-8 px-4">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{task.title}</h1>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {task.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <MoveHorizontalIcon className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Mark as Done</DropdownMenuItem>
                    <DropdownMenuItem>Add to Backlog</DropdownMenuItem>
                    <DropdownMenuItem>Delete Task</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <TagIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">Design, Website</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">Due April 15, 2023</span>
              </div>
            </div>
          </div>
          <Textarea placeholder="Add a description..." className="w-full resize-none" rows={6} defaultValue={task.description} />
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Custom Fields</h2>
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2">
                  <TagIcon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Priority</p>
                    <p className="text-sm text-muted-foreground">High</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TagIcon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Team</p>
                    <p className="text-sm text-muted-foreground">Design</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Comments</h2>
              <div className="space-y-4 mt=2">
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="font-medium">John Doe commented</p>
                    <p className="text-sm text-muted-foreground">"Great progress on the homepage design!"</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="font-medium">Jane Smith assigned you</p>
                    <p className="text-sm text-muted-foreground">"Finalize the homepage design by Friday"</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Textarea placeholder="Write a comment..." className="w-full resize-none" rows={3} />
                <div className="flex justify-end mt-2">
                  <Button size="sm">Post Comment</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="font-medium">John Doe commented</p>
                    <p className="text-sm text-muted-foreground">"Great progress on the homepage design!"</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="font-medium">Jane Smith assigned you</p>
                    <p className="text-sm text-muted-foreground">"Finalize the homepage design by Friday"</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <ClockIcon className="w-6 h-6 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="font-medium">Task created</p>
                    <p className="text-sm text-muted-foreground">"Redesign website homepage"</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FilePenIcon className="w-6 h-6 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="font-medium">Task status updated</p>
                    <p className="text-sm text-muted-foreground">"In Progress" by John Doe</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <PaperclipIcon className="w-6 h-6 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="font-medium">Attachment added</p>
                    <p className="text-sm text-muted-foreground">"Homepage design mockup.jpg"</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CalendarIcon(props:any) {
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
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function ClockIcon(props:any) {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function FilePenIcon(props:any) {
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
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  );
}

function MoveHorizontalIcon(props:any) {
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
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  );
}

function PaperclipIcon(props:any) {
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
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function TagIcon(props:any) {
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
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
    </svg>
  );
}
