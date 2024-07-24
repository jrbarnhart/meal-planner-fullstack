import { Link } from "@remix-run/react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { PHRecipe } from "~/lib/phData";

export default function RecipeEntry({ recipe }: { recipe: PHRecipe }) {
  const { id, name, time, feeds } = recipe;
  return (
    <Card className="grid grid-flow-col grid-cols-[4fr_3fr_2fr_1fr] items-center p-2">
      <p className="truncate">{name[0].toUpperCase() + name.slice(1)}</p>
      <p>{`${time} min`}</p>
      <p>{feeds}</p>
      <Popover>
        <PopoverTrigger>
          <Button variant={"secondary"}>...</Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-3 w-40">
          <p>{name}</p>
          <Button asChild>
            <Link to={`/recipes/${id}`}>Details</Link>
          </Button>
          <Button variant={"destructive"}>Remove</Button>
        </PopoverContent>
      </Popover>
    </Card>
  );
}
