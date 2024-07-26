import { z } from "zod";
import { recipeArraySchema } from "./recipeSchema";

export const mealPlanSchema = z.object({
  id: z.number().int(),
  date: z.date(),
  recipes: recipeArraySchema,
});
