import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";

function MealEntry() {
  return (
    <div className="flex justify-between items-center">
      <p>Recipe Name</p>
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
      </CardHeader>
      <Separator />
      <CardContent className="p-2 pb-8 grid gap-y-2 overflow-y-scroll h-full">
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
