import { z } from "zod";

export const recipeSchema = z.object({
  id: z.number().int().min(0),
  name: z.string().trim().min(1).max(256),
  description: z.string().trim(),
  types: z.array(z.string().trim()),
  time: z.number().int().min(1),
  feeds: z.number().int().min(1),
  requirements: z.array(z.string().trim()),
  ingredients: z.array(z.string().trim()),
  preNotes: z.string().trim(),
  steps: z.array(z.string().trim()),
  postNotes: z.string().trim(),
});

export const recipeArraySchema = z.array(recipeSchema);
