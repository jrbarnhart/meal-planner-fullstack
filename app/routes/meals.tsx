import DayInterface from "~/components/meals/dayInterface";
import DaySlider from "~/components/meals/daySlider";
import MonthSelector from "~/components/meals/monthSelector";
import RouteContent from "~/components/layout/routeContent";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { PHMealPlan } from "~/lib/phData";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getSession } from "~/sessions";
import { mealPlanArraySchema } from "~/lib/zodSchemas/mealPlanSchema";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const isLoggedIn = session.has("userId");

  let mealPlans: PHMealPlan[] = [];
  if (isLoggedIn) {
    mealPlans = []; // Replace with db query
  }

  return json({ mealPlans, isLoggedIn });
}

export default function Meals() {
  const { mealPlans, isLoggedIn } = useLoaderData<typeof loader>();
  const mealPlansWithDates = mealPlans.map((plan) => ({
    ...plan,
    date: new Date(plan.date),
  }));

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [currentMealPlans, setCurrentMealPlans] =
    useState<PHMealPlan[]>(mealPlansWithDates);

  useEffect(() => {
    const localMealsString = localStorage.getItem("localMeals");

    if (!localMealsString) {
      return;
    }

    const localMeals = JSON.parse(localMealsString);

    const zodResults = mealPlanArraySchema.safeParse(localMeals);

    if (!zodResults.success) {
      return console.error(
        "Error parsing meal data. Ensure data in local storage has not been modified manually."
      );
    }

    if (!isLoggedIn) {
      setCurrentMealPlans(zodResults.data);
    }
  }, [isLoggedIn]);

  // Get the range that would be valid for meal plans. This will be the users first meal record date (or today -1 month if less than that or if null) through 5 years from now.
  // This range should be used to dynamically populate the Carousel below.

  return (
    // Month Name Date Picker
    // Fast Day Carousel
    // Detail Day Carousel
    // Meals Interface
    <RouteContent>
      <MonthSelector />
      <DaySlider
        currentMealPlans={currentMealPlans}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <DayInterface />
    </RouteContent>
  );
}
