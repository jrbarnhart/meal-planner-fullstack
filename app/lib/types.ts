import { Prisma } from "@prisma/client";

export type ActionError = { [key: string]: string[] } | undefined;

const mealPlanWithRecipes = Prisma.validator<Prisma.MealPlanDefaultArgs>()({
  include: { recipes: true },
});

export type MealPlanWithRecipes = Prisma.MealPlanGetPayload<
  typeof mealPlanWithRecipes
>;
