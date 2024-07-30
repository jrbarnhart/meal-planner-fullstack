import { PHMealPlan, PHRecipe } from "./phData";
import { mealPlanArraySchema } from "./zodSchemas/mealPlanSchema";
import { recipeArraySchema } from "./zodSchemas/recipeSchema";

export function findLocalRecipeById(id: number) {
  const localRecipesString = localStorage.getItem("localRecipes");

  if (!localRecipesString) return;

  const localRecipes = JSON.parse(localRecipesString);
  const zodResults = recipeArraySchema.safeParse(localRecipes);

  if (!zodResults.success) {
    console.error(
      "Error parsing localRecipes from local storage. Incorrect data format."
    );
    return;
  }
  const verifiedRecipes = zodResults.data;
  return verifiedRecipes.find((verRec) => verRec.id === id);
}

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

export function deleteLocalRecipe(recipe: PHRecipe) {
  const localRecipesString = localStorage.getItem("localRecipes");

  if (!localRecipesString) {
    return console.error("Cannot delete recipe. No local recipes found.");
  }

  const localRecipes = JSON.parse(localRecipesString);
  const zodResults = recipeArraySchema.safeParse(localRecipes);
  if (!zodResults.success) {
    return console.error(
      "Error parsing localRecipes from local storage. Incorrect data format."
    );
  }
  const verifiedRecipes = zodResults.data;
  const newLocalRecipes = verifiedRecipes.filter(
    (verRec) => verRec.id !== recipe.id
  );
  localStorage.setItem("localRecipes", JSON.stringify(newLocalRecipes));
}

export function getLocalId() {
  const currentIdString = localStorage.getItem("currentId");

  if (!currentIdString) {
    localStorage.setItem("currentId", "-1");
    return -1;
  }

  const currentId = parseInt(currentIdString);

  if (isNaN(currentId)) {
    console.error(
      "Error while parsing current id. Resetting to default value (-1)."
    );
    localStorage.setItem("currentId", "-1");
    return -1;
  }

  const nextId = currentId - 1;
  localStorage.setItem("currentId", nextId.toString());

  return nextId;
}

export function createLocalMealPlan(newMealPlan: PHMealPlan) {
  const localMealsString = localStorage.getItem("localMeals");

  const makePlan = () => {
    const localMeals = [newMealPlan];
    localStorage.setItem("localMeals", JSON.stringify(localMeals));
  };

  if (!localMealsString) {
    makePlan();
  } else {
    const localMeals = JSON.parse(localMealsString);
    const zodResults = mealPlanArraySchema.safeParse(localMeals);
    if (!zodResults.success) {
      return console.error(
        "Error parsing localMeals from local storage. Incorrect data format."
      );
    }
    const verifiedMealPlans = zodResults.data;
    const existingMealPlan = verifiedMealPlans.find(
      (plan) => new Date(plan.date).getDate() === newMealPlan.date.getDate()
    );
    if (existingMealPlan) {
      return console.error(
        "Cannot create meal plan. Plan for target date already exists."
      );
    } else {
      makePlan();
    }
  }
}

export function addRecipeToPlan(mealPlan: PHMealPlan, recipeToAdd: PHRecipe) {
  const localMealsString = localStorage.getItem("localMeals");

  if (!localMealsString) {
    return console.error(
      "Cannot add recipe to plan. Plan data does not exist in local storage."
    );
  } else {
    const localMeals = JSON.parse(localMealsString);
    const zodResults = mealPlanArraySchema.safeParse(localMeals);
    if (!zodResults.success) {
      return console.error(
        "Error parsing localMeals from local storage. Incorrect data format."
      );
    }
    const verifiedMealPlans = zodResults.data;
    const existingPlanIndex = verifiedMealPlans.findIndex(
      (plan) => plan.id === mealPlan.id
    );
    if (existingPlanIndex) {
      const newMealPlan = {
        ...verifiedMealPlans[existingPlanIndex],
        recipes: [...verifiedMealPlans[existingPlanIndex].recipes, recipeToAdd],
      };
      const newMealPlans = [...verifiedMealPlans];
      newMealPlans[existingPlanIndex] = newMealPlan;
      localStorage.setItem("localMeals", JSON.stringify(newMealPlans));
    } else {
      return console.error(
        "Cannot add recipe to plan. Plan entry was not found in local storage data."
      );
    }
  }
}
