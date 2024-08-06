import { Recipe } from "@prisma/client";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  json,
  Link,
  useActionData,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { prisma } from "~/client";
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
import { calculateComplexity } from "~/lib/utils";
import { recipeArraySchema } from "~/lib/zodSchemas/recipeSchema";
import { getSession } from "~/sessions";

const RECIPE_TYPES = [
  "breakfast",
  "lunch",
  "dinner",
  "brunch",
  "dessert",
  "snack",
];

const MAX_TIME = 180;

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const isLoggedIn = session.has("userId");
  const userId = parseInt(session.get("userId") ?? "");

  let userRecipes: Recipe[] = [];
  if (isLoggedIn && !isNaN(userId)) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { recipeList: true },
    });
    userRecipes = user?.recipeList ?? [];
  }

  const defaultRecipes = await prisma.recipe.findMany({
    where: { isDefault: true },
    orderBy: { name: "asc" },
  });

  const url = new URL(request.url);
  const sort = url.searchParams.get("sort");
  const feeds = url.searchParams.get("feeds");
  const time = url.searchParams.get("time");
  const types = url.searchParams.get("types");

  let filteredRecipes = defaultRecipes;
  if (feeds) {
    filteredRecipes = filteredRecipes.filter(
      (recipe) => recipe.feeds >= parseInt(feeds)
    );
  }
  if (time) {
    filteredRecipes = filteredRecipes.filter(
      (recipe) => recipe.time <= parseInt(time)
    );
  }
  if (types) {
    const typesArray = types.split(" ");

    filteredRecipes = filteredRecipes.filter((recipe) =>
      recipe.types.some((type) => typesArray.includes(type.toLowerCase()))
    );
  }
  if (sort) {
    filteredRecipes = filteredRecipes.sort((a, b) => {
      if (sort === "alpha") {
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        return 0;
      }
      if (sort === "time") {
        if (a.time > b.time) return 1;
        if (a.time < b.time) return -1;
        return 0;
      }
      if (sort === "complexity") {
        // This only works because calculateComplexity returns a string starting with a number
        if (calculateComplexity(a) > calculateComplexity(b)) return 1;
        if (calculateComplexity(a) < calculateComplexity(b)) return -1;
        return 0;
      }
      if (sort === "feeds") {
        if (a.feeds > b.feeds) return -1;
        if (a.feeds < b.feeds) return 1;
        return 0;
      }
      return 0;
    });
  }

  return json({ isLoggedIn, filteredRecipes, userRecipes });
}

type ActionResponse = {
  updatedRecipes?: Recipe[];
  error?: string;
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const session = await getSession(request.headers.get("Cookie"));
  const userId = parseInt(session.get("userId") ?? "");

  if (formData.get("_action") === "addRecipe") {
    const recipeId = parseInt(formData.get("recipeId")?.toString() ?? "");
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { recipeList: { connect: { id: recipeId } } },
        include: { recipeList: true },
      });
      return json({
        updatedRecipes: updatedUser.recipeList,
      } as ActionResponse);
    } catch (error) {
      console.error(error);
      return json({ error: "Failed to add recipe" } as ActionResponse, {
        status: 500,
      });
    }
  }

  const sort = formData.get("sort");
  const feeds = formData.get("feeds");
  const time = formData.get("time");

  const types: string[] = [];
  for (const [key, value] of formData.entries()) {
    if (value === "on") {
      types.push(key);
    }
  }

  let urlWithParams = "/recipes/library/?";
  if (sort) urlWithParams += `sort=${sort}&`;
  if (feeds) urlWithParams += `feeds=${feeds}&`;
  if (time) urlWithParams += `time=${time}&`;
  if (types.length > 0) {
    urlWithParams += `types=${types.join("+")}`;
  }

  return redirect(urlWithParams);
}

export default function RecipeLibrary() {
  const { isLoggedIn, filteredRecipes, userRecipes } =
    useLoaderData<typeof loader>();
  const [currentUserRecipes, setCurrentUserRecipes] =
    useState<Recipe[]>(userRecipes);

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

  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData?.updatedRecipes) {
      setCurrentUserRecipes(actionData.updatedRecipes);
    }
  }, [actionData]);

  const submit = useSubmit();

  const [searchParams] = useSearchParams();
  const selectedTypes = searchParams.get("types")?.split(" ");
  const selectedSort = searchParams.get("sort");
  const selectedFeeds = searchParams.get("feeds") ?? "1";
  const selectedTime = searchParams.get("time") ?? MAX_TIME.toString();

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
                <select
                  id="sort"
                  name="sort"
                  defaultValue={selectedSort || "alpha"}
                >
                  <option value="alpha">A-Z</option>
                  <option value="time">Prep Time</option>
                  <option value="complexity">Complexity</option>
                  <option value="feeds">Feeds</option>
                </select>
              </div>
              <div className="grid gap-3 grid-cols-[1fr_4fr] items-center">
                <p className="text-sm">Feeds:</p>
                <p>{selectedFeeds}+</p>
                <Slider
                  id="feeds"
                  name="feeds"
                  className="col-span-full"
                  min={1}
                  max={10}
                  step={1}
                  defaultValue={[parseInt(selectedFeeds || "")]}
                />
              </div>
              <div className="grid gap-3 grid-cols-[1fr_4fr] items-center">
                <p className="text-sm">Prep Time:</p>
                <p>
                  {selectedTime +
                    (parseInt(selectedTime) >= MAX_TIME ? " min+" : " min")}
                </p>
                <Slider
                  id="time"
                  name="time"
                  className="col-span-full"
                  min={10}
                  max={180}
                  step={10}
                  defaultValue={[parseInt(selectedTime || "")]}
                />
              </div>
              <div className="flex gap-3 items-center">
                <fieldset id="type" className="grid grid-cols-2 gap-4">
                  <legend>Recipe Type</legend>
                  {RECIPE_TYPES.map((type, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Checkbox
                        id={type}
                        name={type}
                        defaultChecked={selectedTypes?.includes(type)}
                      />
                      <Label htmlFor={type} className="text-lg">
                        {type[0].toUpperCase() + type.slice(1)}
                      </Label>
                    </div>
                  ))}
                </fieldset>
              </div>
            </Form>
          </PopoverContent>
        </Popover>
        <h1 className="text-xl">Recipe Library</h1>
      </div>
      <div className="overflow-y-auto space-y-2">
        {filteredRecipes.map((recipe) => (
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
              ) : isLoggedIn ? (
                <Form method="post">
                  <Button type="submit" name="_action" value="addRecipe">
                    Add
                  </Button>
                  <input type="hidden" name="recipeId" value={recipe.id} />
                </Form>
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
