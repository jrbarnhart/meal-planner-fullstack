// Run this once on a new DB to create default recipe entries
// This will populate the recipe library and allow users to add recipes to their collection from there
import { prisma } from "./app/client";
import bcrypt from "bcryptjs";
import { defaultRecipes } from "./app/lib/phData";

async function createDefaultRecipes() {
  try {
    const passHash = await bcrypt.hash(
      process.env.DEFAULT_USER_PASSWORD ?? "",
      10
    );

    // Create a default user that "owns" the default recipes
    const defaultUserInfo = {
      name: "Default User",
      email: "defaultUser@notanemail.com",
      passHash: passHash,
    };

    const newDefaultUser = await prisma.user.create({ data: defaultUserInfo });

    // Create the default recipes using the new user
    const defaultRecipeData = defaultRecipes.map((recipe) => ({
      ...recipe,
      userId: newDefaultUser.id,
    }));
    await prisma.recipe.createMany({ data: defaultRecipeData });
    console.log("Default user and recipes have been added to database.");
  } catch (err) {
    console.error(err);
  }
}

createDefaultRecipes().catch((err) => {
  console.error("Unhandled error: ", err);
  process.exit(1);
});
