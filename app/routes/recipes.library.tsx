import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, json, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import RouteContent from "~/components/layout/routeContent";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Slider } from "~/components/ui/slider";
import { addLocalRecipe } from "~/lib/localStorageUtils";
import { PHRecipe, phRecipes } from "~/lib/phData";
import { recipeArraySchema } from "~/lib/zodSchemas/recipeSchema";
import { getSession } from "~/sessions";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const isLoggedIn = session.has("userId");

  let userRecipes: PHRecipe[] = [];

  if (isLoggedIn) {
    userRecipes = []; // Replace with db query
  }

  const defaultRecipes = phRecipes; // Replace with db query

  return json({ isLoggedIn, defaultRecipes, userRecipes });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  console.log(formData);
  return null;
}

export default function RecipeLibrary() {
  const { isLoggedIn, defaultRecipes, userRecipes } =
    useLoaderData<typeof loader>();
  const [currentUserRecipes, setCurrentUserRecipes] =
    useState<PHRecipe[]>(userRecipes);

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
    setCurrentUserRecipes(zodResults.data);
  }, [isLoggedIn]);

  const calculateComplexity = (recipe: PHRecipe) => {
    const { time } = recipe;
    const totalRequirements = recipe.requirements.length;
    const totalSteps = recipe.steps.length;
    const totalIngredients = recipe.ingredients.length;
    const timeCeiling = 180;
    const requirementsCeiling = 8;
    const stepsCeiling = 15;
    const ingredientsCeiling = 10;
    const complexity =
      0.33 * (time / timeCeiling) +
      0.2 * (totalRequirements / requirementsCeiling) +
      0.15 * (totalIngredients / ingredientsCeiling) +
      0.32 * (totalSteps / stepsCeiling);
    if (complexity > 0.9) {
      return "5 - Advanced";
    } else if (complexity > 0.75) {
      return "4 - Challenging";
    } else if (complexity > 0.4) {
      return "3 - Intermediate";
    } else if (complexity > 0.3) {
      return "2 - Basic";
    } else return "1 - Easy";
  };

  const submit = useSubmit();

  return (
    <RouteContent>
      <div className="flex items-center justify-between gap-3 w-full">
        <Button asChild>
          <Link to={"/recipes"}>My Recipes</Link>
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button className="flex-grow">Filter</Button>
          </PopoverTrigger>
          <PopoverContent>
            <Form
              method="post"
              className="flex flex-col gap-4"
              onChange={(e) => {
                submit(e.currentTarget);
              }}
            >
              <div className="flex gap-3 items-center">
                <Label htmlFor="sort">Sort By:</Label>
                <select id="sort" name="sort">
                  <option value="alpha">A-Z</option>
                  <option value="time">Prep Time</option>
                  <option value="complexity">Complexity</option>
                  <option value="feeds">Feeds</option>
                </select>
              </div>
              <div className="flex gap-3 items-center">
                <Label htmlFor="feeds">Feeds:</Label>
                <p>1</p>
                <Slider id="feeds" name="feeds" min={1} max={10} step={1} />
                <p>10+</p>
              </div>
              <div className="flex gap-3 items-center">
                <Label htmlFor="time">Prep Time:</Label>
                <p>5m</p>
                <Slider id="time" name="time" min={10} max={180} step={10} />
                <p>3hr</p>
              </div>
              <div className="flex gap-3 items-center">
                <Label htmlFor="type">Type:</Label>
                <fieldset id="type" className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox id="t1" name="breakfast" />
                    <Label htmlFor="t1" className="text-lg">
                      Breakfast
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="t2" name="lunch" />
                    <Label htmlFor="t2" className="text-lg">
                      Lunch
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="t3" name="dinner" />
                    <Label htmlFor="t3" className="text-lg">
                      Dinner
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="t4" name="dessert" />
                    <Label htmlFor="t4" className="text-lg">
                      Dessert
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="t5" name="brunch" />
                    <Label htmlFor="t5" className="text-lg">
                      Brunch
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="t6" name="snacks" />
                    <Label htmlFor="t6" className="text-lg">
                      Snacks
                    </Label>
                  </div>
                </fieldset>
              </div>
            </Form>
          </PopoverContent>
        </Popover>
        <h1 className="text-xl">Recipe Library</h1>
      </div>
      <div className="overflow-y-auto space-y-2">
        {defaultRecipes.map((recipe) => (
          <Card key={recipe.id}>
            <CardHeader>
              <CardTitle>{recipe.name}</CardTitle>
              <CardDescription className="flex gap-3">
                <span className="flex flex-wrap gap-x-2">
                  {recipe.types.map((type, index) => (
                    <span key={index}>{type}</span>
                  ))}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="italic text-sm">{`Feeds: ${recipe.feeds}`}</p>
              <p className="italic text-sm">{`Prep time: ${recipe.time} min`}</p>
              <p className="italic text-sm">{`Complexity: ${calculateComplexity(
                recipe
              )}`}</p>
              <p className="pt-3">{recipe.description}</p>
            </CardContent>
            <CardFooter className="flex gap-4 justify-end">
              {currentUserRecipes.some((curRec) => curRec.id === recipe.id) ? (
                <Button variant={"outline"}>In Library</Button>
              ) : (
                <Button
                  onClick={
                    isLoggedIn
                      ? () => {
                          return; /* replace with db query */
                        }
                      : () => {
                          addLocalRecipe(recipe);
                          const updatedRecipes = [
                            ...currentUserRecipes,
                            recipe,
                          ];
                          setCurrentUserRecipes(updatedRecipes);
                        }
                  }
                  asChild
                >
                  <Link to={"/recipes/library"}>Add</Link>
                </Button>
              )}

              <Button asChild>
                <Link to={`/recipes/${recipe.id}`}>Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </RouteContent>
  );
}
