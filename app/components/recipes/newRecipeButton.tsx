import { useState } from "react";
import useScreenSize from "~/lib/hooks/useScreenSize";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";

export default function NewRecipeButton() {
  const [open, setOpen] = useState<boolean>(false);
  const screenSize = useScreenSize();
  const isDesktop = screenSize.width >= 768;

  if (isDesktop) {
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

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="h-12">Add Recipe</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Recipe</DrawerTitle>
          <DrawerDescription>
            Pick one of our recipes, or add your own.
          </DrawerDescription>
        </DrawerHeader>
        <p>Recipe Drop Down</p>
        <Button>Add Custom Recipe</Button>
      </DrawerContent>
    </Drawer>
  );
}
