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

const phDefaultRecipies = [
  { value: "scrambledEggs", label: "Scrambled Eggs" },
  { value: "poachedEggs", label: "Poached Eggs" },
  { value: "sunnySideEggs", label: "Sunny Side Up Eggs" },
  { value: "cheeseyEggs", label: "Cheesey Eggs" },
  { value: "deviledEggs", label: "Deviled Eggs" },
];

export default function NewRecipeButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-12">Add Recipe</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Recipe</DialogTitle>
          <DialogDescription>
            Pick one of our recipes, or add your own.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-flow-col grid-cols-2 gap-8">
          <Link to={"/recipes/library"}>
            <Button className="w-full">All Our Recipes</Button>
          </Link>
          <Link to={"/recipes/add"}>
            <Button className="w-full">Add Custom Recipe</Button>
          </Link>
        </div>
        <Combobox items={phDefaultRecipies} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}

export function Combobox({
  items,
  setOpen,
}: {
  items: { value: string; label: string }[];
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <>
      <Label htmlFor="search">Search our recipes...</Label>
      <Input id="search" name="search" list="items" autoComplete="off" />
      <datalist id="items">
        {items.map((item) => (
          <option value={item.label} key={item.value} />
        ))}
      </datalist>
      <Button onClick={() => setOpen(false)}>Add Recipe</Button>
    </>
  );
}
