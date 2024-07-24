import { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import RouteContent from "~/components/layout/routeContent";
import NewRecipeButton from "~/components/recipes/newRecipeButton";
import RecipeEntry from "~/components/recipes/recipeEntry";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { PHRecipe } from "~/lib/phData";
import { recipeArraySchema } from "~/lib/zodSchemas/recipeSchema";
import { getSession } from "~/sessions";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const isLoggedIn = session.has("userId");

  let recipes: PHRecipe[] = [];
  if (isLoggedIn) {
    // set recipes using db query for user's recipes
    recipes = [];
  }

  return json({ recipes, isLoggedIn });
}

export default function Recipes() {
  const { recipes, isLoggedIn } = useLoaderData<typeof loader>();
  const [currentRecipes, setCurrentRecipes] = useState<PHRecipe[]>(recipes);

  useEffect(() => {
    const localRecipesString = localStorage.getItem("localRecipes");

    if (!localRecipesString) {
      return console.log("No recipe data found in local storage.");
    }

    const localRecipes = JSON.parse(localRecipesString);

    const zodResults = recipeArraySchema.safeParse(localRecipes);

    if (!zodResults.success) {
      return console.error(
        "Error parsing recipe data. Ensure data in local storage has not been modified manually."
      );
    }

    if (!isLoggedIn) {
      setCurrentRecipes(zodResults.data);
    }
  }, [isLoggedIn]);

  return (
    <RouteContent>
      <div className="flex items-center justify-between w-full">
        <NewRecipeButton recipes={currentRecipes} />
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
          {currentRecipes.map((recipe) => (
            <RecipeEntry key={recipe.id} recipe={recipe} />
          ))}
        </CardContent>
      </Card>
    </RouteContent>
  );
}
