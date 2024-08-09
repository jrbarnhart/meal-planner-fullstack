import { MealPlan, Recipe } from "@prisma/client";
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

export function addLocalRecipe(recipe: Recipe) {
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

export function deleteLocalRecipe(recipe: Recipe) {
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

export function createLocalMealPlan(newMealPlan: MealPlan) {
  const localMealsString = localStorage.getItem("localMeals");

  if (!localMealsString) {
    const localMeals = [newMealPlan];
    localStorage.setItem("localMeals", JSON.stringify(localMeals));
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
      (plan) =>
        new Date(plan.date).getFullYear() === newMealPlan.date.getFullYear() &&
        new Date(plan.date).getMonth() === newMealPlan.date.getMonth() &&
        new Date(plan.date).getDate() === newMealPlan.date.getDate()
    );
    if (existingMealPlan) {
      return console.error(
        "Cannot create meal plan. Plan for target date already exists."
      );
    } else {
      const newLocalMeals = [...verifiedMealPlans, newMealPlan];
      localStorage.setItem("localMeals", JSON.stringify(newLocalMeals));
    }
  }
}

export function addRecipeToPlan(mealPlan: MealPlan, recipeToAdd: Recipe) {
  const localMealsString = localStorage.getItem("localMeals");

  if (!localMealsString) {
    return console.error(
      "Cannot add recipe to plan. Plan data does not exist in local storage."
    );
  }
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
  if (existingPlanIndex !== -1) {
    const newMealPlan = {
      ...verifiedMealPlans[existingPlanIndex],
      recipes: [...verifiedMealPlans[existingPlanIndex].recipes, recipeToAdd],
    };
    const newMealPlans = [...verifiedMealPlans];
    newMealPlans[existingPlanIndex] = newMealPlan;
    localStorage.setItem("localMeals", JSON.stringify(newMealPlans));
  } else {
    console.log(existingPlanIndex, mealPlan.id);
    return console.error(
      "Cannot add recipe to plan. Plan entry was not found in local storage data."
    );
  }
}

export function removeRecipeFromPlan(mealPlan: MealPlan, recipeIndex: number) {
  const localMealsString = localStorage.getItem("localMeals");
  if (!localMealsString) {
    return console.error(
      "Cannot remove recipe from. Plan data does not exist in local storage."
    );
  }
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
  if (existingPlanIndex !== -1) {
    const newRecipes = [...verifiedMealPlans[existingPlanIndex].recipes];
    newRecipes.splice(recipeIndex, 1);
    const newMealPlan = {
      ...verifiedMealPlans[existingPlanIndex],
      recipes: newRecipes,
    };
    if (newMealPlan.recipes.length > 0) {
      const newMealPlans = [...verifiedMealPlans];
      newMealPlans[existingPlanIndex] = newMealPlan;
      localStorage.setItem("localMeals", JSON.stringify(newMealPlans));
    } else {
      const newMealPlans = verifiedMealPlans.filter(
        (plan) => plan.id !== newMealPlan.id
      );
      localStorage.setItem("localMeals", JSON.stringify(newMealPlans));
    }
  } else {
    console.log(existingPlanIndex, mealPlan.id);
    return console.error(
      "Cannot remove recipe from plan. Plan entry was not found in local storage data."
    );
  }
}
