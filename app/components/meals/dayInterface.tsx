import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";

function MealEntry() {
  return (
    <div className="grid grid-flow-col grid-cols-[4fr_3fr_2fr_1fr] items-center text-nowrap">
      <p className="truncate">Recipe Name</p>
      <p>00:00</p>
      <p>4</p>
      <Button>...</Button>
    </div>
  );
}

export default function DayInterface() {
  return (
    <Card className="p-2 w-full overflow-hidden">
      <CardHeader className="p-1 text-lg font-semibold flex items-center">
        <p>Date</p>
        <CardDescription className="grid grid-flow-col grid-cols-[4fr_3fr_2fr_1fr] w-full">
          <span>Recipe Name</span>
          <span>Prep Time</span>
          <span>Feeds</span>
          <span>Actions</span>
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="p-2 pb-16 grid gap-y-2 overflow-y-scroll h-full">
        <MealEntry />
        <MealEntry />
        <MealEntry />
        <MealEntry />
        <MealEntry />
        <MealEntry />
      </CardContent>
    </Card>
  );
}
