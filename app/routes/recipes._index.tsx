import RouteContent from "~/components/routeContent";
import { Button } from "~/components/ui/button";

export default function Recipes() {
  return (
    <RouteContent>
      <div className="flex items-center justify-between w-full">
        <h1>My Recipes</h1>
        <Button>Add</Button>
      </div>
    </RouteContent>
  );
}
