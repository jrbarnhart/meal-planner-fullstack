import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Link } from "@remix-run/react";

export default function AddRecipeButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-32">Add Recipe</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Recipe</DialogTitle>
          <DialogDescription>
            Pick one of our recipes, or add your own.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Button asChild>
            <Link to={"/recipes/library"}>Recipe Library</Link>
          </Button>
          <Button asChild>
            <Link to={"/recipes/add"}>Add Custom Recipe</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
