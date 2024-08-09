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
        <Button>Preview</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Try Munchify Out</DialogTitle>
        <DialogDescription>
          Explore the site before creating an account.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
