import { useTranslation } from 'react-i18next';

export interface Recipe {
  id: string;
  titleKey: string;
  ingredients: string[];
  instructions: string[];
  species: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: string;
  cookTime: string;
  servings: number;
  tags: string[];
}

export interface RecipeWithTranslations extends Omit<Recipe, 'titleKey'> {
  title: string;
}

// Base recipe data without translations
export const RECIPES_DATA: Recipe[] = [
  {
    id: 'chanterelle-pasta',
    titleKey: 'recipes.chanterellePasta.title',
    ingredients: [
      '400g spaghetti',
      '300g chanterelle mushrooms, cleaned',
      '3 cloves garlic, minced',
      '2 tbsp butter',
      '2 tbsp olive oil',
      '1/4 cup white wine',
      '1/2 cup heavy cream',
      '1/2 cup parmesan cheese, grated',
      'Salt and pepper to taste',
      'Fresh parsley, chopped',
    ],
    instructions: [
      'Cook pasta according to package instructions until al dente.',
      'In a large skillet, heat butter and olive oil over medium heat.',
      'Add minced garlic and sauté until fragrant, about 1 minute.',
      'Add chanterelle mushrooms and cook until they release their moisture and begin to brown, about 5-7 minutes.',
      'Pour in white wine and let it reduce for 2-3 minutes.',
      'Add heavy cream and simmer for 3-4 minutes until slightly thickened.',
      'Stir in parmesan cheese until melted and creamy.',
      'Add cooked pasta to the skillet and toss to combine.',
      'Season with salt and pepper to taste.',
      'Garnish with fresh parsley and serve immediately.',
    ],
    species: ['chanterelle'],
    difficulty: 'medium',
    prepTime: '15 minutes',
    cookTime: '20 minutes',
    servings: 4,
    tags: ['pasta', 'mushroom', 'italian', 'dinner'],
  },
  {
    id: 'morel-risotto',
    titleKey: 'recipes.morelRisotto.title',
    ingredients: [
      '1 cup arborio rice',
      '300g morel mushrooms, cleaned and halved',
      '4 cups vegetable or chicken broth',
      '1 small onion, finely diced',
      '2 cloves garlic, minced',
      '1/2 cup white wine',
      '1/2 cup parmesan cheese, grated',
      '2 tbsp butter',
      '2 tbsp olive oil',
      'Salt and pepper to taste',
      'Fresh thyme leaves',
    ],
    instructions: [
      'In a large saucepan, heat broth and keep warm over low heat.',
      'In a separate large pan, heat butter and olive oil over medium heat.',
      'Add diced onion and cook until translucent, about 5 minutes.',
      'Add minced garlic and cook for 1 minute until fragrant.',
      'Add arborio rice and stir to coat with oil, cooking for 2 minutes.',
      'Pour in white wine and stir until absorbed.',
      'Add morel mushrooms and cook for 2-3 minutes.',
      'Begin adding warm broth one ladle at a time, stirring constantly and allowing each addition to be absorbed before adding more.',
      'Continue this process for about 18-20 minutes until rice is creamy and al dente.',
      'Remove from heat and stir in parmesan cheese.',
      'Season with salt and pepper, garnish with fresh thyme, and serve.',
    ],
    species: ['morel'],
    difficulty: 'hard',
    prepTime: '20 minutes',
    cookTime: '25 minutes',
    servings: 4,
    tags: ['risotto', 'mushroom', 'italian', 'dinner'],
  },
  {
    id: 'nettle-soup',
    titleKey: 'recipes.nettleSoup.title',
    ingredients: [
      '500g fresh nettle leaves, washed',
      '1 large potato, diced',
      '1 onion, diced',
      '2 cloves garlic, minced',
      '4 cups vegetable broth',
      '1/2 cup heavy cream',
      '2 tbsp butter',
      'Salt and pepper to taste',
      'Fresh chives for garnish',
    ],
    instructions: [
      'Wear gloves and carefully wash nettle leaves, removing any tough stems.',
      'In a large pot, melt butter over medium heat.',
      'Add diced onion and cook until softened, about 5 minutes.',
      'Add minced garlic and cook for 1 minute.',
      'Add diced potato and vegetable broth, bring to a boil.',
      'Reduce heat and simmer for 15 minutes until potato is tender.',
      'Add nettle leaves and cook for 3-4 minutes until wilted.',
      'Remove from heat and let cool slightly.',
      'Blend soup until smooth using an immersion blender or regular blender.',
      'Return to heat, stir in heavy cream, and season with salt and pepper.',
      'Garnish with fresh chives and serve hot.',
    ],
    species: ['nettle'],
    difficulty: 'easy',
    prepTime: '20 minutes',
    cookTime: '25 minutes',
    servings: 6,
    tags: ['soup', 'vegetarian', 'spring', 'healthy'],
  },
  {
    id: 'elderberry-jam',
    titleKey: 'recipes.elderberryJam.title',
    ingredients: [
      '1kg elderberries, destemmed',
      '500g sugar',
      '1 lemon, juiced',
      '1/2 tsp cinnamon',
      '1/4 tsp nutmeg',
      '1/4 cup water',
    ],
    instructions: [
      'Wash elderberries thoroughly and remove all stems.',
      'In a large pot, combine elderberries, sugar, lemon juice, and water.',
      'Bring to a boil over medium heat, stirring occasionally.',
      'Reduce heat and simmer for 30-40 minutes, stirring frequently.',
      'Add cinnamon and nutmeg, continue cooking for 10 more minutes.',
      'Test for doneness by placing a small amount on a cold plate - it should gel when cooled.',
      'Remove from heat and let cool for 5 minutes.',
      'Pour into sterilized jars and seal tightly.',
      'Store in refrigerator for up to 3 months or process for longer storage.',
    ],
    species: ['elderberry'],
    difficulty: 'medium',
    prepTime: '30 minutes',
    cookTime: '50 minutes',
    servings: 8,
    tags: ['jam', 'preserves', 'breakfast', 'dessert'],
  },
  {
    id: 'wild-garlic-pesto',
    titleKey: 'recipes.wildGarlicPesto.title',
    ingredients: [
      '100g wild garlic leaves, washed',
      '50g pine nuts, toasted',
      '50g parmesan cheese, grated',
      '1 clove garlic',
      '1/2 cup extra virgin olive oil',
      'Salt and pepper to taste',
      '1 tbsp lemon juice',
    ],
    instructions: [
      'Wash wild garlic leaves thoroughly and pat dry.',
      'Toast pine nuts in a dry pan until golden brown, about 3-4 minutes.',
      'In a food processor, combine wild garlic leaves, toasted pine nuts, parmesan cheese, and garlic clove.',
      'Pulse until finely chopped.',
      'With the processor running, slowly drizzle in olive oil until smooth and creamy.',
      'Add lemon juice, salt, and pepper to taste.',
      'Transfer to a jar and cover with a thin layer of olive oil to preserve.',
      'Store in refrigerator for up to 1 week.',
      'Serve with pasta, bread, or as a condiment.',
    ],
    species: ['wild-garlic'],
    difficulty: 'easy',
    prepTime: '15 minutes',
    cookTime: '0 minutes',
    servings: 6,
    tags: ['pesto', 'sauce', 'italian', 'vegetarian'],
  },
];

// Hook for React components
export const useRecipesData = (): RecipeWithTranslations[] => {
  const { t } = useTranslation('recipes');

  return RECIPES_DATA.map(recipe => ({
    ...recipe,
    title: t(recipe.titleKey),
  }));
};

// Utility functions for non-React usage
export const getRecipeById = (id: string): Recipe | undefined => {
  return RECIPES_DATA.find(recipe => recipe.id === id);
};

export const getRecipesBySpecies = (speciesId: string): Recipe[] => {
  return RECIPES_DATA.filter(recipe => recipe.species.includes(speciesId));
};

export const getAllRecipes = (): Recipe[] => {
  return RECIPES_DATA;
};

export const getRecipesByCategory = (category: string): Recipe[] => {
  return RECIPES_DATA.filter(recipe => recipe.tags.includes(category));
};
