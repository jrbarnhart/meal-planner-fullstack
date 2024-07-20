import { SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Link } from "@remix-run/react";
import { PHRecipe } from "~/lib/phData";

export default function NewRecipeButton({ recipes }: { recipes: PHRecipe[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Recipe</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Recipe</DialogTitle>
          <DialogDescription>
            Pick one of our recipes, or add your own.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-flow-col grid-cols-2 gap-8">
          <Button asChild>
            <Link to={"/recipes/library"}>Recipe Library</Link>
          </Button>
          <Button asChild>
            <Link to={"/recipes/add"}>Add Custom Recipe</Link>
          </Button>
        </div>
        <Combobox
          items={recipes.map((recipe) => ({
            id: recipe.id,
            label: recipe.name,
          }))}
          setOpen={setOpen}
        />
        <Button onClick={() => setOpen(false)}>Add Recipe</Button>
      </DialogContent>
    </Dialog>
  );
}

export function Combobox({
  items,
}: {
  items: { id: number; label: string }[];
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <>
      <Label htmlFor="search">Search our recipes...</Label>
      <Input id="search" name="search" list="items" autoComplete="off" />
      <datalist id="items">
        {items.map((item) => (
          <option value={item.label} key={item.id} />
        ))}
      </datalist>
    </>
  );
}
