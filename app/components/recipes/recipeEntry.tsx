import { Button } from "../ui/button";
import { Card } from "../ui/card";

export default function RecipeEntry() {
  return (
    <Card className="grid grid-flow-col grid-cols-[4fr_3fr_2fr_1fr] items-center p-2">
      <p>Name</p>
      <p>00:00</p>
      <p>4</p>
      <Button variant={"secondary"}>...</Button>
    </Card>
  );
}
