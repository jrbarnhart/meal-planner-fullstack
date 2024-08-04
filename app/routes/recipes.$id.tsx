import { Recipe } from "@prisma/client";
import { LoaderFunctionArgs } from "@remix-run/node";
import { json, Link, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { prisma } from "~/client";
import RouteContent from "~/components/layout/routeContent";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { findLocalRecipeById } from "~/lib/localStorageUtils";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id;
  const idNum = parseInt(id || "");
  if (isNaN(idNum)) {
    return { serverRecipe: null, idNum };
  }

  const serverRecipe = await prisma.recipe.findUnique({ where: { id: idNum } });

  return json({ serverRecipe, idNum });
}

export default function RecipeDetails() {
  const { serverRecipe, idNum } = useLoaderData<typeof loader>();
  const [recipe, setRecipe] = useState<Recipe | null | undefined>(serverRecipe);

  useEffect(() => {
    if (!serverRecipe) {
      setRecipe(findLocalRecipeById(idNum));
    }
  }, [idNum, serverRecipe]);

  if (!recipe) {
    return (
      <RouteContent>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Not found.</CardTitle>
          </CardHeader>
          <CardContent>This recipe id was not found.</CardContent>
        </Card>
      </RouteContent>
    );
  }

  return (
    <RouteContent>
      <div className="w-full flex justify-between items-center">
        <Button asChild>
          <Link to={"/recipes"}>My Recipes</Link>
        </Button>
        <h1 className="text-xl">Recipe Details</h1>
      </div>
      <Card className="w-full overflow-y-scroll">
        <CardHeader>
          <CardTitle>{recipe.name}</CardTitle>
          <CardDescription>
            <span className="flex flex-wrap gap-x-2">
              {recipe.types.map((type, index) => (
                <span key={index}>{type}</span>
              ))}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{recipe.description}</p>
          <div>
            <p className="italic">Prep Time: {recipe.time} min</p>
            <p className="italic">Feeds: {recipe.feeds}</p>
          </div>
          <div>
            <h2 className="font-bold">Requirements:</h2>
            <Card className="p-2">
              <CardContent className="p-0">
                <ul className="list-disc pl-4 space-y-2">
                  {recipe.requirements.map((requirement, index) => (
                    <li key={index}>
                      <p>{requirement}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <div>
            <h2 className="font-bold">Ingredients:</h2>
            <Card className="p-2">
              <CardContent className="p-0">
                <ul className="list-disc pl-4 space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>
                      <p>{ingredient}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          {recipe.preNotes ? (
            <div>
              <h2 className="font-bold">Before you start:</h2>
              <p>{recipe.preNotes}</p>
            </div>
          ) : null}
          <div>
            <h2 className="font-bold">Steps:</h2>
            <Card className="p-2">
              <CardContent className="p-0">
                <ul className="list-decimal pl-4 space-y-3">
                  {recipe.steps.map((step, index) => (
                    <li key={index}>
                      <p>{step}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          {recipe.postNotes ? (
            <div>
              <h2 className="font-bold">After you are finished:</h2>
              <p>{recipe.postNotes}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </RouteContent>
  );
}
