import DayInterface from "~/components/meals/dayInterface";
import RouteContent from "~/components/layout/routeContent";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getSession } from "~/sessions";
import { mealPlanArraySchema } from "~/lib/zodSchemas/mealPlanSchema";
import { Calendar } from "~/components/ui/calendar";
import {
  addRecipeToMealSchema,
  recipeArraySchema,
} from "~/lib/zodSchemas/recipeSchema";
import { Recipe } from "@prisma/client";
import { prisma } from "~/client";
import { MealPlanFull } from "~/lib/prisma/mealPlanTypes";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const isLoggedIn = session.has("userId");
  const userId = parseInt(session.get("userId") ?? "");
  if (isNaN(userId)) {
    return json({ isLoggedIn: false, recipes: null, mealPlans: null });
  }

  let mealPlans: MealPlanFull[] = [];
  let recipes: Recipe[] = [];
  if (isLoggedIn) {
    mealPlans = await prisma.mealPlan.findMany({
      where: { userId },
      select: { id: true, date: true, recipes: true, userId: true },
    });
    const foundUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { recipeList: true },
    });
    recipes = foundUser?.recipeList ?? [];
  }

  return json({ mealPlans, recipes, isLoggedIn });
}

type ActionResponse = {
  updatedMealPlan?: MealPlanFull;
  error?: string;
};

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = parseInt(session.get("userId") ?? "");

  const formData = await request.formData();
  const data = {
    recipeId: parseInt(formData.get("recipeId")?.toString() ?? ""),
    date: new Date(formData.get("date")?.toString() ?? ""),
  };

  const zodResults = await addRecipeToMealSchema.safeParse(data);

  if (!zodResults.success) {
    return json({
      error: "Form data is not using correct format.",
    } as ActionResponse);
  }

  const { date, recipeId } = zodResults.data;

  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  // Is there a meal plan for this day?
  const existingMealPlan = await prisma.mealPlan.findUnique({
    where: { userId_date: { userId, date: normalizedDate } },
  });
  try {
    // If no then create the meal plan with the recipe added with nesting
    if (!existingMealPlan) {
      const updatedMealPlan = await prisma.mealPlan.create({
        data: {
          userId,
          date: normalizedDate,
          recipes: { connect: { id: recipeId } },
        },
        include: { recipes: true },
      });
      return json({ updatedMealPlan } as ActionResponse);
    } else {
      // If yes then add the recipe to the plan
      const updatedMealPlan = await prisma.mealPlan.update({
        where: { userId_date: { userId, date: normalizedDate } },
        data: { recipes: { connect: { id: recipeId } } },
        include: { recipes: true },
      });
      return json({ updatedMealPlan } as ActionResponse);
    }
  } catch {
    return json({
      error: "There was an error while adding meal plan.",
    } as ActionResponse);
  }
}

export default function Meals() {
  const { mealPlans, recipes, isLoggedIn } = useLoaderData<typeof loader>();
  const mealPlansWithDates =
    mealPlans?.map((plan) => ({
      ...plan,
      date: new Date(plan.date),
    })) ?? null;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const [currentMealPlans, setCurrentMealPlans] = useState<
    MealPlanFull[] | null
  >(mealPlansWithDates);
  const [currentRecipes, setCurrentRecipes] = useState<Recipe[] | null>(
    recipes
  );

  const [localStorageVersion, setLocalStorageVersion] = useState(0);

  useEffect(() => {
    if (isLoggedIn) return;

    const localMealsString = localStorage.getItem("localMeals");
    const localRecipesString = localStorage.getItem("localRecipes");

    if (!localMealsString && !localRecipesString) {
      return;
    }

    if (localMealsString) {
      const localMeals = JSON.parse(localMealsString);
      const zodResultsMeals = mealPlanArraySchema.safeParse(localMeals);
      if (!zodResultsMeals.success) {
        console.error(
          "Error parsing data. Ensure data in local storage has not been modified manually.",
          zodResultsMeals.error.flatten()
        );
      } else {
        const mealPlans = zodResultsMeals.data;
        const datedMealPlans = mealPlans.map((mealPlan) => ({
          ...mealPlan,
          date: new Date(mealPlan.date),
        }));
        setCurrentMealPlans(datedMealPlans);
      }
    }

    if (localRecipesString) {
      const localRecipes = JSON.parse(localRecipesString);
      const zodResultsRecipes = recipeArraySchema.safeParse(localRecipes);
      if (!zodResultsRecipes.success) {
        console.error(
          "Error parsing data. Ensure data in local storage has not been modified manually.",
          zodResultsRecipes.error.flatten()
        );
      } else {
        setCurrentRecipes(zodResultsRecipes.data);
      }
    }
  }, [isLoggedIn, localStorageVersion]);

  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData?.updatedMealPlan) {
      const updatedMealPlan = actionData.updatedMealPlan;
      const updatedPlanWithDate = {
        ...updatedMealPlan,
        date: new Date(updatedMealPlan.date),
      };

      setCurrentMealPlans((prev) => {
        if (!prev) {
          return [updatedPlanWithDate];
        }

        const prevIndex = prev.findIndex(
          (currentPlan) => currentPlan.id === updatedMealPlan.id
        );

        if (prevIndex !== -1) {
          const updatedMealPlans = prev.map((currentPlan) =>
            currentPlan.id === updatedMealPlan.id
              ? updatedPlanWithDate
              : currentPlan
          );
          return updatedMealPlans;
        } else {
          return [...prev, updatedPlanWithDate];
        }
      });
    }
  }, [actionData]);

  return (
    <RouteContent>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        mealPlans={currentMealPlans}
      />
      <DayInterface
        selectedDate={selectedDate || new Date()}
        currentMealPlans={currentMealPlans}
        recipes={currentRecipes}
        isLoggedIn={isLoggedIn}
        setLocalStorageVersion={setLocalStorageVersion}
      />
    </RouteContent>
  );
}
