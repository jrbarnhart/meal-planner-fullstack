import { MealPlan, Recipe } from "@prisma/client";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { prisma } from "~/client";
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
import { UTCToLocal } from "~/lib/utils";

import { mealPlanArraySchema } from "~/lib/zodSchemas/mealPlanSchema";
import { recipeArraySchema } from "~/lib/zodSchemas/recipeSchema";
import { getSession } from "~/sessions";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const isLoggedIn = session.has("userId");
  const userId = parseInt(session.get("userId") ?? "");
  if (isNaN(userId)) {
    return json({ isLoggedIn: false, foundUser: null });
  }

  const foundUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { mealPlans: true, recipeList: true },
  });
  return json({ isLoggedIn, foundUser });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const session = await getSession(request.headers.get("Cookie"));
  const userId = parseInt(session.get("userId") ?? "");
  // This must be done in case guest user submits form with enter on input
  if (isNaN(userId)) {
    return json({
      error: "Invalid user id. Cannot delete data.",
    });
  }

  const confirmation = formData.get("confirmation");
  try {
    if (confirmation === "DELETE MY DATA") {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { recipeList: { set: [] } },
        }),
        prisma.recipe.deleteMany({ where: { userId } }),
        prisma.mealPlan.deleteMany({ where: { userId } }),
      ]);
      return redirect("/meals");
    }
  } catch (error) {
    console.error(error);
    return json({ error: "Error while deleting user information." });
  }
}

export default function UserDetails() {
  const { isLoggedIn, foundUser } = useLoaderData<typeof loader>();
  const { mealPlans, recipeList } = foundUser ?? {
    mealPlans: null,
    recipeList: null,
  };
  const mealPlansWithDates =
    mealPlans?.map((plan) => ({
      ...plan,
      date: UTCToLocal(new Date(plan.date)),
    })) ?? null;

  const [currentMealPlans, setCurrentMealPlans] = useState<MealPlan[] | null>(
    mealPlansWithDates
  );
  const [currentRecipes, setCurrentRecipes] = useState<Recipe[] | null>(
    recipeList
  );

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
      <div className="w-full flex justify-between items-center max-w-[768px]">
        <h1 className="text-xl ml-auto">User Details</h1>
      </div>
      <Card className="w-full max-w-[768px]">
        <CardHeader>
          <CardTitle>
            {isLoggedIn ? foundUser?.name ?? "User" : "Guest"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>{`Email: ${
            isLoggedIn ? foundUser?.email ?? "Not Found" : "N/A"
          }`}</p>
          <p>{`Total Recipes: ${currentRecipes?.length ?? "Not Found"}`}</p>
          <p>{`Total Meal Plans: ${
            currentMealPlans?.length ?? "Not Found"
          }`}</p>
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
                    name="confirmation"
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
