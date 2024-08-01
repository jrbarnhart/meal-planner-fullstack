import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import RouteContent from "~/components/layout/routeContent";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { PHMealPlan, PHRecipe, PHUser } from "~/lib/phData";
import { mealPlanArraySchema } from "~/lib/zodSchemas/mealPlanSchema";
import { recipeArraySchema } from "~/lib/zodSchemas/recipeSchema";
import { getSession } from "~/sessions";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const isLoggedIn = session.has("userId");
  // Replace these with DB queries
  const user: PHUser = {
    name: "placeholder",
    email: "place@holder.com",
    mealPlans: [],
    recipes: [],
  };
  return { isLoggedIn, user };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  console.log(formData);
  return null;
}

export default function UserDetails() {
  const { isLoggedIn, user } = useLoaderData<typeof loader>();
  const { mealPlans, recipes } = user;
  const mealPlansWithDates = mealPlans.map((plan) => ({
    ...plan,
    date: new Date(plan.date),
  }));

  const [currentMealPlans, setCurrentMealPlans] =
    useState<PHMealPlan[]>(mealPlansWithDates);
  const [currentRecipes, setCurrentRecipes] = useState<PHRecipe[]>(recipes);

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
  }, [isLoggedIn]);

  const confirmationRef = useRef<HTMLInputElement>(null);
  const [confirmationError, setConfirmationError] = useState<
    string | undefined
  >();

  const handleLocalDelete = () => {
    if (
      confirmationRef.current &&
      confirmationRef.current.value === "DELETE MY DATA"
    ) {
      localStorage.clear();
      location.reload();
    } else {
      setConfirmationError(
        "Error. Make sure confirmation is correct with spaces and capitalization."
      );
    }
  };

  return (
    <RouteContent>
      <div className="w-full flex justify-between items-center">
        {isLoggedIn ? <Button variant={"secondary"}>Log Out</Button> : null}
        <h1 className="text-xl ml-auto">User Details</h1>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{isLoggedIn ? user.name : "Guest"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>{`Email: ${isLoggedIn ? user.email : "N/A"}`}</p>
          <p>{`Total Recipes: ${currentRecipes.length}`}</p>
          <p>{`Total Meal Plans: ${currentMealPlans.length}`}</p>
          <Separator />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"destructive"}>Delete All User Data</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete all user data?</DialogTitle>
                <DialogDescription className="text-destructive">
                  This action cannot be undone. All your recipes and meal plans
                  will be permanently deleted!
                </DialogDescription>
              </DialogHeader>
              <Form method="POST" className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="confirmation">{`Type "DELETE MY DATA" if you are sure you want to delete all of your data.`}</Label>
                  <Input
                    ref={confirmationRef}
                    autoComplete="off"
                    className="text-destructive"
                    id="confirmation"
                  ></Input>
                  {confirmationError ? (
                    <p className="text-destructive text-sm">
                      {confirmationError}
                    </p>
                  ) : null}
                </div>
                {isLoggedIn ? (
                  <Button variant={"destructive"} className="w-full">
                    Permanently Delete User Data
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleLocalDelete}
                    variant={"destructive"}
                    className="w-full"
                  >
                    Permanently Delete User Data
                  </Button>
                )}
              </Form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </RouteContent>
  );
}
