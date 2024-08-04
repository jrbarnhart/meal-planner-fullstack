// https://www.prisma.io/docs/orm/prisma-client/type-safety/operating-against-partial-structures-of-model-types
// These types created following the above guide. Leverages prisma type generation instead of manually maintained types.

import { Prisma } from "@prisma/client";

const fullUserNoPass = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: { id: true, name: true, email: true, recipes: true, mealPlans: true },
});

export type FullUserNoPass = Prisma.UserGetPayload<typeof fullUserNoPass>;
