import { formatDateForTitle } from "~/lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";
import { PHMealPlan, PHRecipe } from "~/lib/phData";

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

export default function DayInterface({
  ...props
}: {
  selectedDate: Date;
  currentMealPlans: PHMealPlan[];
}) {
  const { selectedDate, currentMealPlans } = props;
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
        {currentMealPlans
          .find((meal) => meal.date.getDate() === selectedDate.getDate())
          ?.recipes.map((recipe, index) => (
            <MealEntry recipe={recipe} key={index} />
          ))}
        <Button className="w-36 h-12 my-4 justify-self-center">+</Button>
      </CardContent>
    </Card>
  );
}
