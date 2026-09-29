import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Task title must be at least 3 characters")
    .max(100, "Task title cannot exceed 100 characters"),
});

export const searchSchema = z.object({
  search: z
    .string()
    .trim()
    .max(50, "Search query cannot exceed 50 characters"),
});