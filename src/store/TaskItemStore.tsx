import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { type TaskItemProps } from "../libs/Task";
import { type TaskProps } from "../libs/Task";
import { persist, createJSONStorage } from "zustand/middleware";

export const useTaskStore = create<TaskItemProps>()(
  persist(
    (set) => ({
      tasks: [] as TaskProps[],

      setTasks: (tasks) => set({ tasks }),

      addTask: (title, description, dueDate, assignees) =>
        set((state) => ({
          tasks: [
            {
              id: uuidv4(),
              title,
              description,
              dueDate,
              isDone: false,
              doneAt: null,
              assignees,
            },
            ...state.tasks,
          ],
        })),

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  isDone: !task.isDone,
                  doneAt: task.isDone ? null : new Date().toLocaleDateString(),
                }
              : task
          ),
        })),

      removeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
    }),
    {
      name: "keys",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ tasks: state.tasks }),
      
    }));