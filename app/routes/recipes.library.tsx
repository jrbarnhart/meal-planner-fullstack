import RouteContent from "~/components/layout/routeContent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { PHRecipe, phRecipes } from "~/lib/phData";

export default function RecipeLibrary() {
  const recipes = phRecipes;

  const calculateComplexity = (recipe: PHRecipe) => {
    const { time } = recipe;
    const totalRequirements = recipe.requirements.length;
    const totalSteps = recipe.steps.length;
    const totalIngredients = recipe.ingredients.length;
    const timeCeiling = 180;
    const requirementsCeiling = 8;
    const stepsCeiling = 15;
    const ingredientsCeiling = 10;
    const complexity =
      0.33 * (time / timeCeiling) +
      0.2 * (totalRequirements / requirementsCeiling) +
      0.15 * (totalIngredients / ingredientsCeiling) +
      0.32 * (totalSteps / stepsCeiling);
    if (complexity > 0.9) {
      return "5 - Advanced";
    } else if (complexity > 0.75) {
      return "4 - Challenging";
    } else if (complexity > 0.4) {
      return "3 - Intermediate";
    } else if (complexity > 0.3) {
      return "2 - Basic";
    } else return "1 - Easy";
  };

  return (
    <RouteContent>
      <div className="overflow-y-auto">
        {recipes.map((recipe) => (
          <Card key={recipe.id}>
            <CardHeader>
              <CardTitle>{recipe.name}</CardTitle>
              <CardDescription className="flex gap-4">
                <span>{recipe.time} Min</span>
                <span>Feeds {recipe.feeds}</span>
                <span>{calculateComplexity(recipe)}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>{recipe.description}</CardContent>
          </Card>
        ))}
      </div>
    </RouteContent>
  );
}
