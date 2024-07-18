export const phRecipes: PHRecipe[] = [
  {
    name: "Simple Pancakes",
    descriptions: "A quick and easy recipe for fluffy pancakes.",
    types: ["Breakfast"],
    time: 900,
    feeds: 4,
    requirements: ["mixing bowl", "whisk", "griddle or frying pan"],
    preNotes: "Make sure to preheat the griddle or pan.",
    steps: [
      "In a mixing bowl, whisk together flour, baking powder, salt, and sugar.",
      "Add milk, egg, and melted butter to the dry ingredients and whisk until smooth.",
      "Pour batter onto the preheated griddle or pan.",
      "Cook until bubbles form on the surface, then flip and cook until golden brown.",
      "Serve hot with syrup or toppings of choice.",
    ],
    postNotes: "Leftover batter can be stored in the fridge for up to 2 days.",
    ingredients: [
      "1 cup flour",
      "2 tbsp sugar",
      "1 tbsp baking powder",
      "1/2 tsp salt",
      "1 cup milk",
      "1 egg",
      "2 tbsp melted butter",
    ],
  },
  {
    name: "Grilled Cheese Sandwich",
    descriptions:
      "A classic grilled cheese sandwich with a crispy golden crust.",
    types: ["Brunch", "Lunch"],
    time: 600,
    feeds: 1,
    requirements: ["frying pan", "spatula"],
    preNotes: "Butter both sides of the bread for a crispier texture.",
    steps: [
      "Heat the frying pan over medium heat.",
      "Butter one side of each bread slice.",
      "Place one slice, buttered side down, in the pan.",
      "Add cheese slices on top of the bread in the pan.",
      "Top with the second slice of bread, buttered side up.",
      "Cook until golden brown, then flip and cook until the cheese is melted and the other side is golden brown.",
    ],
    postNotes: "Serve with tomato soup for a classic combination.",
    ingredients: ["2 slices of bread", "2 slices of cheese", "2 tbsp butter"],
  },
  {
    name: "Spaghetti Aglio e Olio",
    descriptions:
      "A simple and flavorful Italian pasta dish with garlic and olive oil.",
    types: ["Dinner"],
    time: 1200,
    feeds: 2,
    requirements: ["large pot", "frying pan", "tongs"],
    preNotes: "Use fresh garlic for the best flavor.",
    steps: [
      "Cook spaghetti according to package instructions.",
      "While the spaghetti cooks, heat olive oil in a frying pan over medium heat.",
      "Add sliced garlic and red pepper flakes to the pan and cook until fragrant.",
      "Drain the spaghetti and add it to the pan.",
      "Toss the spaghetti in the garlic oil until well coated.",
      "Serve with grated Parmesan cheese and chopped parsley.",
    ],
    postNotes:
      "Adjust the amount of red pepper flakes to your spice preference.",
    ingredients: [
      "200g spaghetti",
      "1/4 cup olive oil",
      "4 cloves garlic, sliced",
      "1/2 tsp red pepper flakes",
      "Parmesan cheese, grated",
      "Fresh parsley, chopped",
    ],
  },
  {
    name: "Chicken Salad",
    descriptions: "A light and refreshing chicken salad with a tangy dressing.",
    types: ["Brunch", "Lunch"],
    time: 600,
    feeds: 2,
    requirements: ["mixing bowl", "whisk"],
    preNotes: "Use leftover cooked chicken for a quick meal.",
    steps: [
      "In a mixing bowl, whisk together mayonnaise, mustard, lemon juice, salt, and pepper.",
      "Add shredded chicken, celery, and chopped green onions to the bowl.",
      "Toss everything together until well combined.",
      "Serve on a bed of lettuce or as a sandwich filling.",
    ],
    postNotes: "Refrigerate any leftovers and consume within 2 days.",
    ingredients: [
      "2 cups cooked chicken, shredded",
      "1/4 cup mayonnaise",
      "1 tbsp mustard",
      "1 tbsp lemon juice",
      "1/2 cup celery, chopped",
      "2 green onions, chopped",
      "Salt and pepper to taste",
    ],
  },
  {
    name: "Fruit Smoothie",
    descriptions: "A refreshing and healthy fruit smoothie.",
    types: ["Breakfast", "Snack", "Desert"],
    time: 300,
    feeds: 2,
    requirements: ["blender"],
    preNotes: "Use frozen fruit for a thicker smoothie.",
    steps: [
      "Add all ingredients to the blender.",
      "Blend until smooth.",
      "Pour into glasses and serve immediately.",
    ],
    postNotes: "Experiment with different fruit combinations for variety.",
    ingredients: [
      "1 banana",
      "1 cup frozen berries",
      "1 cup orange juice",
      "1/2 cup yogurt",
      "1 tbsp honey",
    ],
  },
  {
    name: "Omelette",
    descriptions: "A quick and easy omelette with your choice of fillings.",
    types: ["Breakfast", "Brunch"],
    time: 600,
    feeds: 1,
    requirements: ["frying pan", "spatula"],
    preNotes: "Beat the eggs well to incorporate air for a fluffier omelette.",
    steps: [
      "Beat the eggs with salt and pepper in a bowl.",
      "Heat butter in a frying pan over medium heat.",
      "Pour the eggs into the pan and cook until they start to set.",
      "Add your choice of fillings on one half of the omelette.",
      "Fold the omelette in half and cook until fully set.",
      "Slide onto a plate and serve hot.",
    ],
    postNotes:
      "Common fillings include cheese, ham, mushrooms, and bell peppers.",
    ingredients: [
      "2 eggs",
      "Salt and pepper to taste",
      "1 tbsp butter",
      "Choice of fillings (e.g., cheese, ham, vegetables)",
    ],
  },
  {
    name: "Tomato Basil Soup",
    descriptions: "A creamy and flavorful tomato basil soup.",
    types: ["Brunch", "Lunch", "Dinner"],
    time: 1200,
    feeds: 4,
    requirements: ["large pot", "blender or immersion blender"],
    preNotes: "Use fresh basil for the best flavor.",
    steps: [
      "Heat olive oil in a large pot over medium heat.",
      "Add chopped onions and cook until soft.",
      "Add garlic and cook for another minute.",
      "Add canned tomatoes, vegetable broth, and chopped basil.",
      "Simmer for 15 minutes.",
      "Blend the soup until smooth using a blender or immersion blender.",
      "Return the soup to the pot, stir in cream, and season with salt and pepper.",
      "Serve hot with a drizzle of olive oil and extra basil leaves.",
    ],
    postNotes: "This soup pairs well with a grilled cheese sandwich.",
    ingredients: [
      "1 tbsp olive oil",
      "1 onion, chopped",
      "3 cloves garlic, minced",
      "2 cans (28 oz) whole tomatoes",
      "2 cups vegetable broth",
      "1/2 cup fresh basil, chopped",
      "1/2 cup cream",
      "Salt and pepper to taste",
    ],
  },
  {
    name: "Quick Stir-Fry Vegetables",
    descriptions: "A fast and healthy vegetable stir-fry.",
    types: ["Dinner"],
    time: 900,
    feeds: 2,
    requirements: ["wok or large frying pan", "spatula"],
    preNotes: "Prepare all ingredients before starting to cook.",
    steps: [
      "Heat oil in a wok or large frying pan over high heat.",
      "Add garlic and ginger and stir-fry for 30 seconds.",
      "Add vegetables and stir-fry until tender-crisp.",
      "Add soy sauce and stir to coat the vegetables.",
      "Serve hot over rice or noodles.",
    ],
    postNotes:
      "Use a variety of colorful vegetables for a more appealing dish.",
    ingredients: [
      "2 tbsp vegetable oil",
      "2 cloves garlic, minced",
      "1 tbsp fresh ginger, minced",
      "4 cups mixed vegetables (e.g., bell peppers, broccoli, carrots, snap peas)",
      "2 tbsp soy sauce",
    ],
  },
  {
    name: "Banana Bread",
    descriptions: "A moist and delicious banana bread with a hint of cinnamon.",
    types: ["Desert", "Brunch"],
    time: 3600,
    feeds: 8,
    requirements: ["mixing bowl", "loaf pan", "oven"],
    preNotes: "Use overripe bananas for the best flavor.",
    steps: [
      "Preheat the oven to 350°F (175°C).",
      "In a mixing bowl, mash the bananas.",
      "Add melted butter, sugar, egg, and vanilla extract to the bananas and mix well.",
      "In a separate bowl, combine flour, baking soda, salt, and cinnamon.",
      "Add the dry ingredients to the wet ingredients and mix until just combined.",
      "Pour the batter into a greased loaf pan.",
      "Bake for 60 minutes or until a toothpick inserted into the center comes out clean.",
      "Cool in the pan for 10 minutes, then transfer to a wire rack to cool completely.",
    ],
    postNotes: "Banana bread can be frozen for up to 3 months.",
    ingredients: [
      "3 ripe bananas",
      "1/3 cup melted butter",
      "3/4 cup sugar",
      "1 egg",
      "1 tsp vanilla extract",
      "1 tsp baking soda",
      "1/4 tsp salt",
      "1 1/2 cups flour",
      "1 tsp cinnamon",
    ],
  },
  {
    name: "Caesar Salad",
    descriptions:
      "A classic Caesar salad with creamy dressing and crunchy croutons.",
    types: ["Lunch", "Dinner"],
    time: 600,
    feeds: 4,
    requirements: ["large mixing bowl", "whisk"],
    preNotes: "Use fresh, crisp romaine lettuce for the best texture.",
    steps: [
      "In a large mixing bowl, whisk together mayonnaise, lemon juice, Dijon mustard, Worcestershire sauce, garlic, and anchovy paste.",
      "Gradually whisk in olive oil until the dressing is smooth and creamy.",
      "Add chopped romaine lettuce to the bowl and toss to coat with the dressing.",
      "Top with grated Parmesan cheese and croutons.",
      "Serve immediately.",
    ],
    postNotes: "Add grilled chicken or shrimp for a more substantial meal.",
    ingredients: [
      "1/2 cup mayonnaise",
      "2 tbsp lemon juice",
      "1 tsp Dijon mustard",
      "1 tsp Worcestershire sauce",
      "2 cloves garlic, minced",
      "1 tsp anchovy paste",
      "1/4 cup olive oil",
      "1 head romaine lettuce, chopped",
      "1/4 cup grated Parmesan cheese",
      "1 cup croutons",
    ],
  },
];

export const phRecipeTypes: PHRecipeTypes = [
  { label: "Breakfast", id: 1 },
  { label: "Brunch", id: 2 },
  { label: "Lunch", id: 3 },
  { label: "Dinner", id: 4 },
  { label: "Desert", id: 5 },
  { label: "Snacks", id: 6 },
  { label: "Snacks2", id: 7 },
  { label: "Snacks3", id: 8 },
  { label: "Snacks4", id: 9 },
  { label: "Snacks5", id: 10 },
];

type PHRecipe = {
  name: string;
  descriptions: string;
  types: string[];
  // Prep time in seconds
  time: number;
  feeds: number;
  requirements: string[];
  preNotes: string;
  steps: string[];
  postNotes: string;
  ingredients: string[];
};

type PHRecipeTypes = {
  label: string;
  id: number;
}[];
