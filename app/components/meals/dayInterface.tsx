import { formatDateForTitle } from "~/lib/utils";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { SetStateAction, useRef, useState } from "react";
import {
  addRecipeToPlan,
  createLocalMealPlan,
  getLocalId,
  removeRecipeFromPlan,
} from "~/lib/localStorageUtils";
import { Form, Link, useSubmit } from "@remix-run/react";
import { MealPlan, Recipe } from "@prisma/client";
import { MealPlanFull } from "~/lib/prisma/mealPlanTypes";
import AddRecipeButton from "../recipes/addRecipeButton";

function MealEntry({
  ...props
}: {
  recipe: Recipe;
  isLoggedIn: boolean;
  mealPlan: MealPlan;
  handleDeleteClickLocal: () => void;
}) {
  const { recipe, isLoggedIn, mealPlan, handleDeleteClickLocal } = props;
  return (
    <div className="grid grid-flow-col grid-cols-[4fr_3fr_2fr_1fr] items-center text-nowrap">
      <Link to={`/recipes/${recipe.id}`} className="truncate text-accent">
        {recipe.name}
      </Link>
      <p>{`${recipe.time} min`}</p>
      <p>{recipe.feeds}</p>
      <Form method="post">
        <input type="hidden" name="deleteId" value={recipe.id} />
        <input type="hidden" name="mealPlanId" value={mealPlan.id} />
        {isLoggedIn ? (
          <Button type="submit" variant={"outline"} className="text-red-500">
            X
          </Button>
        ) : (
          <Button
            type="button"
            variant={"outline"}
            className="text-red-500 font-bold"
            onClick={() => {
              handleDeleteClickLocal();
            }}
          >
            X
          </Button>
        )}
      </Form>
    </div>
  );
}

function AddRecipeSelect({
  ...props
}: {
  recipes: Recipe[] | null;
  date: Date;
  isLoggedIn: boolean;
  setLocalStorageVersion: React.Dispatch<SetStateAction<number>>;
  mealPlan?: MealPlan;
}) {
  const { recipes, date, isLoggedIn, setLocalStorageVersion, mealPlan } = props;

  const [selectedRecipe, setSelectedRecipe] = useState("");

  const onLocalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const recipeToAdd = recipes?.find(
      (rec) => rec.id === parseInt(event.target.value)
    );
    if (!recipeToAdd) {
      return console.error(
        "Recipe was not found in your recipes data. Local storage data may have been manually edited."
      );
    }

    if (mealPlan) {
      addRecipeToPlan(mealPlan, recipeToAdd);
      setSelectedRecipe("");
      setLocalStorageVersion((prev) => prev + 1);
    } else {
      const newMealPlan = {
        id: getLocalId(),
        date,
        recipes: [recipeToAdd],
        userId: -1, // Local user doesn't have an id
      };
      createLocalMealPlan(newMealPlan);
      setSelectedRecipe("");
      setLocalStorageVersion((prev) => prev + 1);
    }
  };

  const submit = useSubmit();
  const formRef = useRef(null);

  return (
    <Form method="post" ref={formRef}>
      <input type="hidden" name="date" value={date.toISOString()} />
      <select
        name="recipeId"
        value={selectedRecipe}
        className="h-10 w-full rounded-md bg-primary text-primary-foreground"
        onChange={(e) => {
          if (isLoggedIn) {
            submit(formRef.current);
            setSelectedRecipe("");
          } else {
            setSelectedRecipe(e.target.value);
            onLocalChange(e);
          }
        }}
      >
        <option value="">--Select a Recipe--</option>
        {recipes
          ?.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
          })
          .map((recipe) => (
            <option key={recipe.id} value={recipe.id}>
              {recipe.name[0].toUpperCase() + recipe.name.slice(1)}
            </option>
          ))}
      </select>
    </Form>
  );
}

export default function DayInterface({
  ...props
}: {
  selectedDate: Date;
  currentMealPlans: MealPlanFull[] | null;
  recipes: Recipe[] | null;
  isLoggedIn: boolean;
  setLocalStorageVersion: React.Dispatch<SetStateAction<number>>;
}) {
  const {
    selectedDate,
    currentMealPlans,
    recipes,
    isLoggedIn,
    setLocalStorageVersion,
  } = props;

  return (
    <Card className="p-2 w-full h-full overflow-hidden flex flex-col">
      <CardHeader className="p-1 text-lg font-semibold flex items-center">
        <CardTitle>{formatDateForTitle(selectedDate)}</CardTitle>
        <CardDescription className="grid grid-flow-col grid-cols-[4fr_3fr_2fr_1fr] w-full">
          <span>Recipe Name</span>
          <span>Prep Time</span>
          <span>Feeds</span>
          <span>Remove</span>
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="p-2 pb-16 grid gap-y-2 overflow-y-scroll h-full">
        {(() => {
          const meal = currentMealPlans?.find(
            (meal) =>
              meal.date.getFullYear() === selectedDate.getFullYear() &&
              meal.date.getMonth() === selectedDate.getMonth() &&
              meal.date.getDate() === selectedDate.getDate()
          );

          return meal?.recipes?.map((recipe, index) => (
            <MealEntry
              recipe={recipe}
              key={index}
              isLoggedIn={isLoggedIn}
              mealPlan={meal}
              handleDeleteClickLocal={() => {
                removeRecipeFromPlan(meal, index);
                setLocalStorageVersion((prev) => prev + 1);
              }}
            />
          ));
        })()}
        {recipes && recipes.length > 0 ? (
          <AddRecipeSelect
            recipes={recipes}
            date={selectedDate}
            isLoggedIn={isLoggedIn}
            mealPlan={currentMealPlans?.find(
              (meal) =>
                meal.date.getFullYear() === selectedDate.getFullYear() &&
                meal.date.getMonth() === selectedDate.getMonth() &&
                meal.date.getDate() === selectedDate.getDate()
            )}
            setLocalStorageVersion={setLocalStorageVersion}
          />
        ) : (
          <div className="grid space-y-0 items-center">
            <p className="text-center p-0">
              {"You don't have any recipes yet."}
            </p>
            <AddRecipeButton />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
