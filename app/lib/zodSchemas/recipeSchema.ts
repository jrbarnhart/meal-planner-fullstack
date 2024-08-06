import { z } from "zod";

export const localRecipeSchema = z.object({
  // -int to prevent clashes with db ids
  id: z.number().int(),
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
  userId: z.number().int(),
  isDefault: z.boolean(),
});

export const addLocalRecipeSchema = z.object({
  // -int to prevent clashes with db ids
  id: z.number().int().max(-1),
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
  userId: z.number().int(),
  isDefault: z.boolean(),
});

export const addRecipeSchema = z.object({
  userId: z.number().int(),
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

export const addRecipeToMealSchema = z.object({
  recipeId: z.number().int(),
  date: z.date(),
});

export const recipeArraySchema = z.array(localRecipeSchema);
