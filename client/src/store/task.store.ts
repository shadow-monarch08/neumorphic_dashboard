// src/store/auth.store.ts
import { create } from "zustand";
import { type Task } from "../types/tasks";

interface TaskState {
  tasks: Map<string, Task> | null;
  loading: boolean;
  addTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  initiateTask: (tasks: Task[]) => void;
}

export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: null,
  loading: false,
  initiateTask: (tasks) => {
    const newMap = new Map<string, Task>();
    tasks.forEach((element) => {
      newMap.set(element._id, element);
    });

    set({
      tasks: newMap,
    });
  },
  addTask: (task) => {
    const newMap = get().tasks;
    newMap?.set(task._id, task);
    set({
      tasks: newMap,
    });
  },
  deleteTask: (taskId) => {
    const newMap = get().tasks;
    newMap?.delete(taskId);
    set({
      tasks: newMap,
    });
  },
}));
