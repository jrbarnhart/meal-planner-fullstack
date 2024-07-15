import RouteContent from "~/components/layout/routeContent";
import RecipeEntry from "~/components/recipes/recipeEntry";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "~/components/ui/card";

export default function Recipes() {
  return (
    <RouteContent>
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl">My Recipes</h1>
        <Button>Add Recipe</Button>
      </div>
      <Card className="w-full h-full">
        <CardHeader>
          <CardDescription className="grid grid-flow-col grid-cols-[4fr_3fr_2fr_1fr]">
            <span>Name</span>
            <span>Time</span>
            <span>Feeds</span>
            <span>Actions</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecipeEntry />
        </CardContent>
      </Card>
    </RouteContent>
  );
}
