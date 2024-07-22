import { json, Link, useLoaderData } from "@remix-run/react";
import RouteContent from "~/components/layout/routeContent";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { phRecipes } from "~/lib/phData";

export async function loader() {
  const recipe = phRecipes[0]; // Replace with DB query
  return json(recipe);
}

export default function RecipeDetails() {
  const recipe = useLoaderData<typeof loader>();

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
          <CardDescription>{recipe.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-x-2">
            {recipe.types.map((type, index) => (
              <p key={index}>{type}</p>
            ))}
          </div>
          <p>Prep Time: {recipe.time} min</p>
          <p>Feeds: {recipe.feeds}</p>
          <h2>Requirements:</h2>
          <Card className="p-2">
            <CardContent className="p-0">
              <ul className="list-disc pl-4">
                {recipe.requirements.map((requirement, index) => (
                  <li key={index}>
                    <p>{requirement}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <h2>Ingredients:</h2>
          <Card className="p-2">
            <CardContent className="p-0">
              <ul className="list-disc pl-4">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    <p>{ingredient}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          {recipe.preNotes ? (
            <>
              <h2>Before you start:</h2>
              <p>{recipe.preNotes}</p>
            </>
          ) : null}
          <h2>Steps:</h2>
          <Card className="p-2">
            <CardContent className="p-0">
              <ul className="list-decimal pl-4">
                {recipe.steps.map((step, index) => (
                  <li key={index}>
                    <p>{step}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          {recipe.postNotes ? (
            <>
              <h2>After you are finished:</h2>
              <p>{recipe.postNotes}</p>
            </>
          ) : null}
        </CardContent>
      </Card>
    </RouteContent>
  );
}
