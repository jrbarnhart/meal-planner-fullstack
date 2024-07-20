import { json, Link, useLoaderData } from "@remix-run/react";
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
import { PHRecipe, phRecipes } from "~/lib/phData";

export async function loader() {
  const recipes = phRecipes;

  return json(recipes);
}

export default function RecipeLibrary() {
  const recipes = useLoaderData<typeof loader>();

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

  return (
    <RouteContent>
      <div className="flex items-center justify-between gap-3 w-full">
        <Link to={"/recipes"}>
          <Button>My Recipes</Button>
        </Link>
        <Popover>
          <PopoverTrigger asChild>
            <Button className="flex-grow">Filter</Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
              <Label htmlFor="sort">Sort By:</Label>
              <select id="sort">
                <option value="alpha">A-Z</option>
                <option value="time">Prep Time</option>
                <option value="complexity">Difficulty</option>
                <option value="feeds">Feeds</option>
              </select>
            </div>
            <div className="flex gap-3 items-center">
              <Label htmlFor="feeds">Feeds:</Label>
              <p>1</p>
              <Slider id="feeds" min={1} max={10} step={1} />
              <p>10+</p>
            </div>
            <div className="flex gap-3 items-center">
              <Label htmlFor="time">Prep Time:</Label>
              <p>5m</p>
              <Slider id="time" min={10} max={180} step={10} />
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
          </PopoverContent>
        </Popover>
        <h1 className="text-xl">Recipe Library</h1>
      </div>
      <div className="overflow-y-auto space-y-2">
        {recipes.map((recipe) => (
          <Card key={recipe.id}>
            <CardHeader>
              <CardTitle>{recipe.name}</CardTitle>
              <CardDescription className="flex gap-3">
                <span>{recipe.time} Min</span>
                <span>Feeds {recipe.feeds}</span>
                <span>Difficulty: {calculateComplexity(recipe)}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>{recipe.description}</CardContent>
            <CardFooter className="flex gap-4 justify-end">
              <Link to={"/recipes"}>
                <Button>Add</Button>
              </Link>
              <Link to={`/recipes/${recipe.id}`}>
                <Button>Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </RouteContent>
  );
}
