"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/api/client";
import { CreateTaskRequest } from "@/api/generated";

interface TaskCreateDialogProps {
  onTaskCreated?: () => void;
}

export function TaskCreateDialog({ onTaskCreated }: TaskCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const userData =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      const token = userData ? JSON.parse(userData).token : null;

      if (!token) {
        setError("You must be logged in to create a task");
        setLoading(false);
        return;
      }

      const formattedTitle =
        title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();

      const taskData: CreateTaskRequest = {
        title: formattedTitle,
        description,
      };
      const userTask = await api.tasks.tasksPost({
        title: formattedTitle,
        description,
      });
      setOpen(false);
      if (onTaskCreated) {
        onTaskCreated();
      }
    } catch (error: any) {
      console.error("Error creating task:", error);
      setError(
        error.response?.data?.message ||
          "Failed to create task. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add new Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add new Task</DialogTitle>
            <DialogDescription>
              Create a new task here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError("");
                }}
                placeholder="Enter task title"
                disabled={loading}
                className={error ? "border-red-500" : ""}
              />
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                placeholder="Enter task description"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => {
                  setTitle("");
                  setError("");
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading || !title.trim()}>
              {loading ? "Creating..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
