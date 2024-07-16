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

export default function NewRecipeButton() {
  const [open, setOpen] = useState<boolean>(false);

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
        <p>Recipe Drop Down</p>
        <Button>Add Custom Recipe</Button>
      </DialogContent>
    </Dialog>
  );
}
