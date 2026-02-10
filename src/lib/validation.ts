import { z } from "zod";

export const activitySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters"),
  location: z
    .string()
    .trim()
    .min(1, "Location is required")
    .max(200, "Location must be less than 200 characters"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  participants: z
    .number()
    .int("Participants must be a whole number")
    .min(0, "Participants cannot be negative")
    .max(10000, "Participants cannot exceed 10,000"),
  image_url: z.string().url().nullable().optional(),
});

export type ActivityFormData = z.infer<typeof activitySchema>;
