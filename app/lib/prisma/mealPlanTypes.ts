// https://www.prisma.io/docs/orm/prisma-client/type-safety/operating-against-partial-structures-of-model-types
// These types created following the above guide. Leverages prisma type generation instead of manually maintained types.

import { Prisma } from "@prisma/client";

const mealPlanFull = Prisma.validator<Prisma.MealPlanDefaultArgs>()({
  include: { recipes: true },
});

export type MealPlanFull = Prisma.MealPlanGetPayload<typeof mealPlanFull>;
