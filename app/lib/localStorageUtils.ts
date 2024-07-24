import { PHRecipe } from "./phData";
import { recipeArraySchema } from "./zodSchemas/recipeSchema";

export function addLocalRecipe(recipe: PHRecipe) {
  const localRecipesString = localStorage.getItem("localRecipes");

  if (!localRecipesString) {
    const localRecipes = [recipe];
    localStorage.setItem("localRecipes", JSON.stringify(localRecipes));
  } else {
    const localRecipes = JSON.parse(localRecipesString);
    const zodResults = recipeArraySchema.safeParse(localRecipes);
    if (!zodResults.success) {
      return console.error(
        "Error parsing localRecipes from local storage. Incorrect data format."
      );
    }
    const verifiedRecipes = zodResults.data;
    const recipeAlreadyAdded = verifiedRecipes.some(
      (verRec) => verRec.id === recipe.id
    );
    if (recipeAlreadyAdded) {
      return console.log("Recipe already has been added to local storage.");
    } else {
      const newLocalRecipes = [...verifiedRecipes, recipe];
      localStorage.setItem("localRecipes", JSON.stringify(newLocalRecipes));
    }
  }
}
