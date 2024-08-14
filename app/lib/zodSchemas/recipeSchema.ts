import { z } from "zod";

const numSchema = z
  .number({ message: "Must be an integer (1, 2, 3, etc)" })
  .int({ message: "Must be an integer (1, 2, 3, etc)" })
  .min(1, { message: "Must be 1 or greater." });

const nameSchema = z
  .string()
  .trim()
  .min(1, { message: "Name must be at least 1 character long." })
  .max(256, { message: "Name must be at most 256 characters long" });

export const localRecipeSchema = z.object({
  // -int to prevent clashes with db ids
  id: z.number().int(),
  name: nameSchema,
  description: z.string().trim(),
  types: z.array(z.string().trim(), {
    message: "At least one type is required.",
  }),
  time: numSchema,
  feeds: numSchema,
  requirements: z.array(z.string().trim(), {
    message: "At least one requirement is required.",
  }),
  ingredients: z.array(z.string().trim(), {
    message: "At least one ingredient is required.",
  }),
  preNotes: z.string().trim(),
  steps: z.array(z.string().trim(), {
    message: "At least one step is required.",
  }),
  postNotes: z.string().trim(),
  userId: z.number().int(),
  isDefault: z.boolean(),
});

export const addRecipeSchema = z.object({
  userId: z.number().int(),
  name: nameSchema,
  description: z.string().trim(),
  types: z.array(z.string().trim(), {
    message: "At least one type is required.",
  }),
  time: numSchema,
  feeds: numSchema,
  requirements: z.array(z.string().trim(), {
    message: "At least one requirement is required.",
  }),
  ingredients: z.array(z.string().trim(), {
    message: "At least one ingredient is required.",
  }),
  preNotes: z.string().trim(),
  steps: z.array(z.string().trim(), {
    message: "At least one step is required.",
  }),
  postNotes: z.string().trim(),
});

export const addRecipeToMealSchema = z.object({
  recipeId: z.number().int(),
  date: z.date(),
});

export const recipeArraySchema = z.array(localRecipeSchema);
