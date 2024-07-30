import { formatDateForTitle } from "~/lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";
import { PHMealPlan, PHRecipe } from "~/lib/phData";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { addLocaMealPlan, getLocalId } from "~/lib/localStorageUtils";

function MealEntry({ recipe }: { recipe: PHRecipe }) {
  return (
    <div className="grid grid-flow-col grid-cols-[4fr_3fr_2fr_1fr] items-center text-nowrap">
      <p className="truncate">{recipe.name}</p>
      <p>{`${recipe.time} min`}</p>
      <p>{`Feeds ${recipe.feeds}`}</p>
      <Button variant={"secondary"}>...</Button>
    </div>
  );
}

function AddMealButton({
  ...props
}: {
  recipes: PHRecipe[];
  date: Date;
  isLoggedIn: boolean;
  mealPlan?: PHMealPlan;
}) {
  const { recipes, date, isLoggedIn, mealPlan } = props;
  const [open, setOpen] = useState<boolean>(false);

  const onLocalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // If mealPlan then add recipe to it
    if (mealPlan) {
      const recipeToAdd = recipes.find(
        (rec) => rec.id === parseInt(event.target.value)
      );
      if (!recipeToAdd) {
        return console.error(
          "Recipe was not found in your recipes data. Local storage data may have been manually edited."
        );
      }
      const updatedMealPlan = {
        ...mealPlan,
        recipes: [...mealPlan.recipes, recipeToAdd],
      };
      addLocaMealPlan(updatedMealPlan);
    } else {
      const recipeToAdd = recipes.find(
        (rec) => rec.id === parseInt(event.target.value)
      );
      if (!recipeToAdd) {
        return console.error(
          "Recipe was not found in your recipes data. Local storage data may have been manually edited."
        );
      }
      const newMealPlan: PHMealPlan = {
        id: getLocalId(),
        date,
        recipes: [recipeToAdd],
      };
      addLocaMealPlan(newMealPlan);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-36 h-12 my-4 justify-self-center">
          Add Recipe
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Recipe</DialogTitle>
          <DialogDescription>Select from your recipes.</DialogDescription>
        </DialogHeader>
        <select
          onChange={(e) => {
            if (isLoggedIn) {
              // Handle DB Operation for editing/adding meal plan
              console.log("DB Action not yet set implemented.");
            } else {
              onLocalChange(e);
            }
          }}
        >
          <option value="">--Select a Recipe--</option>
          {recipes.map((recipe) => (
            <option key={recipe.id} value={recipe.id}>
              {recipe.name[0].toUpperCase() + recipe.name.slice(1)}
            </option>
          ))}
        </select>
      </DialogContent>
    </Dialog>
  );
}

export default function DayInterface({
  ...props
}: {
  selectedDate: Date;
  currentMealPlans: PHMealPlan[];
  recipes: PHRecipe[];
  isLoggedIn: boolean;
}) {
  const { selectedDate, currentMealPlans, recipes, isLoggedIn } = props;
  const currentMealPlan = currentMealPlans.find(
    (meal) => meal.date.getDate() === selectedDate.getDate()
  );

  return (
    <Card className="p-2 w-full overflow-hidden">
      <CardHeader className="p-1 text-lg font-semibold flex items-center">
        <p>{formatDateForTitle(selectedDate)}</p>
        <CardDescription className="grid grid-flow-col grid-cols-[4fr_3fr_2fr_1fr] w-full">
          <span>Recipe Name</span>
          <span>Prep Time</span>
          <span>Feeds</span>
          <span>Actions</span>
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="p-2 pb-16 grid gap-y-2 overflow-y-scroll h-full">
        {currentMealPlan?.recipes.map((recipe, index) => (
          <MealEntry recipe={recipe} key={index} />
        ))}
        <AddMealButton
          recipes={recipes}
          date={selectedDate}
          isLoggedIn={isLoggedIn}
          mealPlan={currentMealPlan}
        />
      </CardContent>
    </Card>
  );
}
