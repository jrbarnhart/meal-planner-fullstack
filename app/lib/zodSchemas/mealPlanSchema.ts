import { z } from "zod";
import { recipeArraySchema } from "./recipeSchema";

export const mealPlanSchema = z.object({
  id: z.number().int(),
  date: z.date().or(z.string()),
  recipes: recipeArraySchema,
  userId: z.number().int(),
});

export const mealPlanArraySchema = z.array(mealPlanSchema);
