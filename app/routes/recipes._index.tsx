import { Recipe } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { prisma } from "~/client";
import RouteContent from "~/components/layout/routeContent";
import AddRecipeButton from "~/components/recipes/addRecipeButton";
import RecipeEntry from "~/components/recipes/recipeEntry";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { recipeArraySchema } from "~/lib/zodSchemas/recipeSchema";
import { getSession } from "~/sessions";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const isLoggedIn = session.has("userId");

  if (!isLoggedIn) {
    return json({ userRecipes: null, isLoggedIn });
  }

  const userId = parseInt(session.get("userId") ?? "");
  if (isNaN(userId)) {
    return json({ isLoggedIn: false, userRecipes: null });
  }

  const userWithRecipeList = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      recipeList: true,
    },
  });

  const userRecipes = userWithRecipeList?.recipeList ?? [];

  return json({ userRecipes, isLoggedIn });
}
// TypeScript is losing the inferred types unless I do this. No idea why.
type ActionResponse = {
  updatedRecipes?: Recipe[];
  error?: string;
};

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = parseInt(session.get("userId") ?? "");
  const formData = await request.formData();
  const recipeId = parseInt(formData.get("recipeId")?.toString() ?? "");

  try {
    const recipeToRemove = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { recipeList: { disconnect: { id: recipeId } } },
      include: { recipeList: true },
    });

    if (
      recipeToRemove?.userId === userId &&
      recipeToRemove.isDefault === false
    ) {
      // This is a user's recipe that they are removing from their recipes list, so delete it
      await prisma.recipe.delete({ where: { id: recipeToRemove.id } });
    }

    return json({ updatedRecipes: updatedUser.recipeList } as ActionResponse);
  } catch (error) {
    console.error(error);
    return json({ error: "Failed to remove recipe." } as ActionResponse);
  }
}

export default function Recipes() {
  const { userRecipes, isLoggedIn } = useLoaderData<typeof loader>();
  const [currentRecipes, setCurrentRecipes] = useState<Recipe[] | null>(
    userRecipes
  );

  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (isLoggedIn) return;

    const localRecipesString = localStorage.getItem("localRecipes");

    if (!localRecipesString) {
      return;
    }

    const localRecipes = JSON.parse(localRecipesString);

    const zodResults = recipeArraySchema.safeParse(localRecipes);

    if (!zodResults.success) {
      return console.error(
        "Error parsing recipe data. Ensure data in local storage has not been modified manually."
      );
    }

    setCurrentRecipes(zodResults.data);
  }, [isLoggedIn]);

  useEffect(() => {
    if (actionData?.updatedRecipes) {
      setCurrentRecipes([...actionData.updatedRecipes]);
    }
  }, [actionData]);

  return (
    <RouteContent>
      <div className="flex items-center justify-between w-full">
        <AddRecipeButton />
        <h1 className="text-xl">My Recipes</h1>
      </div>
      <Card className="w-full h-full overflow-hidden">
        <CardHeader>
          <CardDescription className="grid grid-flow-col grid-cols-[4fr_3fr_2fr_1fr]">
            <span>Name</span>
            <span>Time</span>
            <span>Feeds</span>
            <span>Actions</span>
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="overflow-y-scroll h-full space-y-2 pb-20 pt-2">
          {currentRecipes?.map((recipe) => (
            <RecipeEntry
              key={recipe.id}
              recipe={recipe}
              isLoggedIn={isLoggedIn}
              setCurrentRecipes={setCurrentRecipes}
            />
          )) ?? <p>No user recipes found.</p>}
        </CardContent>
      </Card>
    </RouteContent>
  );
}
