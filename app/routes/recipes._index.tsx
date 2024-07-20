import RouteContent from "~/components/layout/routeContent";
import NewRecipeButton from "~/components/recipes/newRecipeButton";
import RecipeEntry from "~/components/recipes/recipeEntry";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { phRecipes } from "~/lib/phData";

export default function Recipes() {
  return (
    <RouteContent>
      <div className="flex items-center justify-between w-full overflow-hidden">
        <NewRecipeButton recipes={phRecipes} />
        <h1 className="text-xl">My Recipes</h1>
      </div>
      <Card className="w-full h-full overflow-hidden">
        <CardHeader>
          <CardDescription className="grid grid-flow-col grid-cols-[4fr_3fr_2fr_1fr]">
            <span>Name</span>
            <span>Time</span>
            <span>Feeds</span>
            <span>Actions</span>
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="overflow-y-scroll h-full space-y-2 pb-20 pt-2">
          <RecipeEntry />
          <RecipeEntry />
          <RecipeEntry />
          <RecipeEntry />
          <RecipeEntry />
          <RecipeEntry />
          <RecipeEntry />
          <RecipeEntry />
          <RecipeEntry />
          <RecipeEntry />
          <RecipeEntry />
          <RecipeEntry />
        </CardContent>
      </Card>
    </RouteContent>
  );
}
