"use client";

import React, { useState } from "react";
import { TaskCreateDialog } from "./components/todo-create-dialog";
import { Input } from "@/components/ui/input";
import KanbanBoard from "./components/kanban-board";

export default function TaskManager() {
  return (
    <div className=" mx-auto space-y-4">
      <div>
        <KanbanBoard />
      </div>
    </div>
  );
}
