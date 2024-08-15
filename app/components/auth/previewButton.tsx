import { Link } from "@remix-run/react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function PreviewButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="md:h-12 md:text-base">
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Have a look around!</DialogTitle>
        <DialogDescription>
          Explore the site before creating an account.
        </DialogDescription>
        <p className="text-sm lg:text-base">
          <span className="text-destructive font-bold">Please note:</span>{" "}
          {
            "Preview mode saves data locally to your device. You'll need to recreate it if you sign up for an account, and it won't sync across different devices."
          }
        </p>
        <Button className="w-full md:h-12 md:text-base" asChild>
          <Link to={"/meals"}>Continue</Link>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
