import DayInterface from "~/components/meals/dayInterface";
import RouteContent from "~/components/layout/routeContent";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getSession } from "~/sessions";
import { mealPlanArraySchema } from "~/lib/zodSchemas/mealPlanSchema";
import { Calendar } from "~/components/ui/calendar";
import { recipeArraySchema } from "~/lib/zodSchemas/recipeSchema";
import { Recipe } from "@prisma/client";
import { prisma } from "~/client";
import { MealPlanFull } from "~/lib/prisma/mealPlanTypes";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const isLoggedIn = session.has("userId");
  const userId = parseInt(session.id);
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
    recipes = await prisma.recipe.findMany({ where: { userId } });
  }

  return json({ mealPlans, recipes, isLoggedIn });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  console.log(formData);
  return null;
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
