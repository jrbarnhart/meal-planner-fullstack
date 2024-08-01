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
import { PHMealPlan, PHRecipe } from "~/lib/phData";
import { SetStateAction, useState } from "react";
import {
  addRecipeToPlan,
  createLocalMealPlan,
  getLocalId,
  removeRecipeFromPlan,
} from "~/lib/localStorageUtils";
import { Form } from "@remix-run/react";

function MealEntry({
  ...props
}: {
  recipe: PHRecipe;
  isLoggedIn: boolean;
  handleDeleteClick: () => void;
}) {
  const { recipe, isLoggedIn, handleDeleteClick } = props;
  return (
    <div className="grid grid-flow-col grid-cols-[4fr_3fr_2fr_1fr] items-center text-nowrap">
      <p className="truncate">{recipe.name}</p>
      <p>{`${recipe.time} min`}</p>
      <p>{recipe.feeds}</p>
      <Form method="post">
        <input type="hidden" name="deleteId" value={recipe.id} />
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
              handleDeleteClick();
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
  recipes: PHRecipe[];
  date: Date;
  isLoggedIn: boolean;
  setLocalStorageVersion: React.Dispatch<SetStateAction<number>>;
  mealPlan?: PHMealPlan;
}) {
  const { recipes, date, isLoggedIn, setLocalStorageVersion, mealPlan } = props;

  const [selectedRecipe, setSelectedRecipe] = useState("");

  const onLocalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const recipeToAdd = recipes.find(
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
      const newMealPlan: PHMealPlan = {
        id: getLocalId(),
        date,
        recipes: [recipeToAdd],
      };
      createLocalMealPlan(newMealPlan);
      setSelectedRecipe("");
      setLocalStorageVersion((prev) => prev + 1);
    }
  };

  return (
    <select
      value={selectedRecipe}
      className="h-10 rounded-md bg-primary text-primary-foreground"
      onChange={(e) => {
        if (isLoggedIn) {
          // Handle DB Operation for editing/adding meal plan
          console.log("DB Action not yet set implemented.");
          setSelectedRecipe(e.target.value);
        } else {
          setSelectedRecipe(e.target.value);
          onLocalChange(e);
        }
      }}
    >
      <option value="">--Select a Recipe--</option>
      {recipes
        .sort((a, b) => {
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
  );
}

export default function DayInterface({
  ...props
}: {
  selectedDate: Date;
  currentMealPlans: PHMealPlan[];
  recipes: PHRecipe[];
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
          const meal = currentMealPlans.find(
            (meal) => meal.date.getDate() === selectedDate.getDate()
          );

          return meal?.recipes.map((recipe, index) => (
            <MealEntry
              recipe={recipe}
              key={index}
              isLoggedIn={isLoggedIn}
              handleDeleteClick={() => {
                removeRecipeFromPlan(meal, index);
                setLocalStorageVersion((prev) => prev + 1);
              }}
            />
          ));
        })()}
        <AddRecipeSelect
          recipes={recipes}
          date={selectedDate}
          isLoggedIn={isLoggedIn}
          mealPlan={currentMealPlans.find(
            (meal) => meal.date.getDate() === selectedDate.getDate()
          )}
          setLocalStorageVersion={setLocalStorageVersion}
        />
      </CardContent>
    </Card>
  );
}
