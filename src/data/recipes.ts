import { useTranslation } from 'react-i18next';

export interface RecipeStep {
  step: number;
  instruction: string;
  warning?: string;
  tip?: string;
  duration?: string;
}

export interface Recipe {
  id: string;
  titleKey: string;
  ingredients: string[];
  instructions: string[];
  steps: RecipeStep[];
  warnings: string[];
  species: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: string;
  cookTime: string;
  servings: number;
  tags: string[];
  safetyNotes: string[];
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
    steps: [
      {
        step: 1,
        instruction:
          'Cook pasta according to package instructions until al dente.',
        tip: 'Reserve 1 cup of pasta water for adjusting sauce consistency if needed.',
        duration: '8-10 minutes',
      },
      {
        step: 2,
        instruction:
          'In a large skillet, heat butter and olive oil over medium heat.',
        warning:
          'Be careful not to let the butter burn - it should be foamy but not brown.',
        duration: '1 minute',
      },
      {
        step: 3,
        instruction:
          'Add minced garlic and sauté until fragrant, about 1 minute.',
        warning:
          "Garlic burns quickly - keep stirring and don't let it turn brown.",
        duration: '1 minute',
      },
      {
        step: 4,
        instruction:
          'Add chanterelle mushrooms and cook until they release their moisture and begin to brown, about 5-7 minutes.',
        tip: "Don't overcrowd the pan - mushrooms need space to brown properly.",
        warning:
          'Ensure mushrooms are thoroughly cleaned and properly identified as chanterelles.',
        duration: '5-7 minutes',
      },
      {
        step: 5,
        instruction: 'Pour in white wine and let it reduce for 2-3 minutes.',
        tip: 'Use a dry white wine like Pinot Grigio or Sauvignon Blanc.',
        duration: '2-3 minutes',
      },
      {
        step: 6,
        instruction:
          'Add heavy cream and simmer for 3-4 minutes until slightly thickened.',
        warning: "Don't let the cream boil vigorously - it can curdle.",
        duration: '3-4 minutes',
      },
      {
        step: 7,
        instruction: 'Stir in parmesan cheese until melted and creamy.',
        tip: 'Use freshly grated parmesan for the best flavor and texture.',
        duration: '1-2 minutes',
      },
      {
        step: 8,
        instruction: 'Add cooked pasta to the skillet and toss to combine.',
        tip: 'Add reserved pasta water if the sauce is too thick.',
        duration: '1 minute',
      },
      {
        step: 9,
        instruction: 'Season with salt and pepper to taste.',
        tip: 'Remember that parmesan is salty, so taste before adding more salt.',
        duration: '30 seconds',
      },
      {
        step: 10,
        instruction: 'Garnish with fresh parsley and serve immediately.',
        tip: 'Serve with extra parmesan cheese on the side.',
        duration: '1 minute',
      },
    ],
    warnings: [
      '⚠️ WARNING: Only use chanterelle mushrooms that you have positively identified or purchased from a reliable source.',
      '⚠️ Never consume wild mushrooms unless you are 100% certain of their identification.',
      '⚠️ If you experience any adverse reactions after consuming mushrooms, seek medical attention immediately.',
      '⚠️ Some people may be allergic to mushrooms - test with a small amount first.',
    ],
    species: ['chanterelle'],
    difficulty: 'medium',
    prepTime: '15 minutes',
    cookTime: '20 minutes',
    servings: 4,
    tags: ['pasta', 'mushroom', 'italian', 'dinner'],
    safetyNotes: [
      'Always properly identify wild mushrooms before consumption',
      'Clean mushrooms thoroughly to remove dirt and debris',
      'Cook mushrooms thoroughly - never eat raw wild mushrooms',
      'Store leftovers in refrigerator and consume within 2 days',
    ],
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
    steps: [
      {
        step: 1,
        instruction:
          'In a large saucepan, heat broth and keep warm over low heat.',
        tip: 'Warm broth helps the rice cook evenly and absorb liquid properly.',
        duration: '5 minutes',
      },
      {
        step: 2,
        instruction:
          'In a separate large pan, heat butter and olive oil over medium heat.',
        warning:
          "Don't let the butter burn - it should be foamy but not brown.",
        duration: '1 minute',
      },
      {
        step: 3,
        instruction:
          'Add diced onion and cook until translucent, about 5 minutes.',
        tip: 'Stir occasionally to prevent sticking and ensure even cooking.',
        duration: '5 minutes',
      },
      {
        step: 4,
        instruction: 'Add minced garlic and cook for 1 minute until fragrant.',
        warning:
          "Garlic burns quickly - keep stirring and don't let it turn brown.",
        duration: '1 minute',
      },
      {
        step: 5,
        instruction:
          'Add arborio rice and stir to coat with oil, cooking for 2 minutes.',
        tip: 'The rice should become slightly translucent around the edges.',
        duration: '2 minutes',
      },
      {
        step: 6,
        instruction: 'Pour in white wine and stir until absorbed.',
        tip: 'Use a dry white wine that you would drink.',
        duration: '2-3 minutes',
      },
      {
        step: 7,
        instruction: 'Add morel mushrooms and cook for 2-3 minutes.',
        warning:
          'Ensure morels are thoroughly cleaned and properly identified.',
        tip: 'Morels should be halved lengthwise to check for insects.',
        duration: '2-3 minutes',
      },
      {
        step: 8,
        instruction:
          'Begin adding warm broth one ladle at a time, stirring constantly and allowing each addition to be absorbed before adding more.',
        warning:
          "Constant stirring is essential for creamy risotto - don't walk away!",
        tip: 'The rice should always be covered with liquid but not swimming in it.',
        duration: '18-20 minutes',
      },
      {
        step: 9,
        instruction:
          'Continue this process for about 18-20 minutes until rice is creamy and al dente.',
        tip: 'Test the rice - it should be tender but still have a slight bite.',
        duration: '18-20 minutes',
      },
      {
        step: 10,
        instruction: 'Remove from heat and stir in parmesan cheese.',
        tip: 'The residual heat will melt the cheese and create a creamy texture.',
        duration: '1 minute',
      },
      {
        step: 11,
        instruction:
          'Season with salt and pepper, garnish with fresh thyme, and serve.',
        tip: 'Risotto should be served immediately while still hot and creamy.',
        duration: '1 minute',
      },
    ],
    warnings: [
      '⚠️ WARNING: Morel mushrooms are highly toxic when raw and must be cooked thoroughly.',
      '⚠️ Only use morels that you have positively identified or purchased from a reliable source.',
      '⚠️ False morels can be deadly - never consume mushrooms unless you are 100% certain of identification.',
      '⚠️ Morels should always be cooked for at least 10-15 minutes to destroy toxins.',
      '⚠️ If you experience any adverse reactions, seek medical attention immediately.',
    ],
    species: ['morel'],
    difficulty: 'hard',
    prepTime: '20 minutes',
    cookTime: '25 minutes',
    servings: 4,
    tags: ['risotto', 'mushroom', 'italian', 'dinner'],
    safetyNotes: [
      'Morels must be cooked thoroughly - never eat raw',
      'Always properly identify morels before consumption',
      'Clean morels thoroughly and check for insects',
      'Morels should be cooked for at least 10-15 minutes',
      'Store leftovers in refrigerator and consume within 1 day',
    ],
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
    steps: [
      {
        step: 1,
        instruction:
          'Wear gloves and carefully wash nettle leaves, removing any tough stems.',
        warning:
          '⚠️ CRITICAL: Always wear thick gloves when handling fresh nettles - they have stinging hairs!',
        tip: 'Use rubber gloves or thick gardening gloves to protect your hands.',
        duration: '10 minutes',
      },
      {
        step: 2,
        instruction: 'In a large pot, melt butter over medium heat.',
        tip: 'Use a large pot as nettles take up a lot of space before cooking.',
        duration: '1 minute',
      },
      {
        step: 3,
        instruction:
          'Add diced onion and cook until softened, about 5 minutes.',
        tip: 'Stir occasionally to prevent sticking.',
        duration: '5 minutes',
      },
      {
        step: 4,
        instruction: 'Add minced garlic and cook for 1 minute.',
        warning:
          "Garlic burns quickly - keep stirring and don't let it turn brown.",
        duration: '1 minute',
      },
      {
        step: 5,
        instruction: 'Add diced potato and vegetable broth, bring to a boil.',
        tip: 'The potato will help thicken the soup naturally.',
        duration: '3-5 minutes',
      },
      {
        step: 6,
        instruction:
          'Reduce heat and simmer for 15 minutes until potato is tender.',
        tip: 'Test potato with a fork - it should be easily pierced.',
        duration: '15 minutes',
      },
      {
        step: 7,
        instruction: 'Add nettle leaves and cook for 3-4 minutes until wilted.',
        warning:
          '⚠️ The nettles will still sting until cooked - use tongs to add them!',
        tip: 'The nettles will reduce significantly in volume as they cook.',
        duration: '3-4 minutes',
      },
      {
        step: 8,
        instruction: 'Remove from heat and let cool slightly.',
        tip: 'Let it cool for 5 minutes before blending to avoid burns.',
        duration: '5 minutes',
      },
      {
        step: 9,
        instruction:
          'Blend soup until smooth using an immersion blender or regular blender.',
        warning:
          '⚠️ Be careful when blending hot liquids - they can cause burns if they splash.',
        tip: 'If using a regular blender, blend in batches and hold the lid firmly.',
        duration: '2-3 minutes',
      },
      {
        step: 10,
        instruction:
          'Return to heat, stir in heavy cream, and season with salt and pepper.',
        tip: "Don't let the soup boil after adding cream - it can curdle.",
        duration: '2 minutes',
      },
      {
        step: 11,
        instruction: 'Garnish with fresh chives and serve hot.',
        tip: 'Nettle soup is best served immediately while hot.',
        duration: '1 minute',
      },
    ],
    warnings: [
      '⚠️ CRITICAL: Always wear thick gloves when handling fresh nettles - they have stinging hairs!',
      '⚠️ Never touch fresh nettles with bare hands - they will cause painful stings.',
      '⚠️ Only harvest nettles from clean, unpolluted areas away from roads and industrial sites.',
      '⚠️ Avoid nettles that have been sprayed with pesticides or herbicides.',
      '⚠️ If you experience severe allergic reactions to nettle stings, do not attempt this recipe.',
      '⚠️ Pregnant women should avoid consuming large amounts of nettles.',
    ],
    species: ['nettle'],
    difficulty: 'easy',
    prepTime: '20 minutes',
    cookTime: '25 minutes',
    servings: 6,
    tags: ['soup', 'vegetarian', 'spring', 'healthy'],
    safetyNotes: [
      'Always wear gloves when handling fresh nettles',
      'Only harvest from clean, unpolluted areas',
      'Cook nettles thoroughly to neutralize stinging compounds',
      'Avoid if you have allergies to stinging plants',
      'Store leftovers in refrigerator and consume within 2 days',
    ],
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
    steps: [
      {
        step: 1,
        instruction: 'Wash elderberries thoroughly and remove all stems.',
        warning:
          '⚠️ CRITICAL: Remove ALL stems, leaves, and unripe berries - they contain toxic compounds!',
        tip: 'Use a fork to gently remove berries from stems. Discard any green or unripe berries.',
        duration: '20 minutes',
      },
      {
        step: 2,
        instruction:
          'In a large pot, combine elderberries, sugar, lemon juice, and water.',
        tip: 'Use a heavy-bottomed pot to prevent scorching.',
        duration: '2 minutes',
      },
      {
        step: 3,
        instruction: 'Bring to a boil over medium heat, stirring occasionally.',
        warning: '⚠️ Hot sugar can cause severe burns - be very careful!',
        tip: 'Stir gently to avoid crushing the berries too much.',
        duration: '5-8 minutes',
      },
      {
        step: 4,
        instruction:
          'Reduce heat and simmer for 30-40 minutes, stirring frequently.',
        warning:
          '⚠️ The mixture will be very hot and can splatter - use a long spoon and wear oven mitts.',
        tip: 'Stir every 2-3 minutes to prevent sticking and burning.',
        duration: '30-40 minutes',
      },
      {
        step: 5,
        instruction:
          'Add cinnamon and nutmeg, continue cooking for 10 more minutes.',
        tip: 'The spices will enhance the flavor of the elderberries.',
        duration: '10 minutes',
      },
      {
        step: 6,
        instruction:
          'Test for doneness by placing a small amount on a cold plate - it should gel when cooled.',
        tip: "If it doesn't gel, continue cooking for 5 more minutes and test again.",
        duration: '5 minutes',
      },
      {
        step: 7,
        instruction: 'Remove from heat and let cool for 5 minutes.',
        warning:
          '⚠️ The jam will still be very hot - be careful when handling.',
        duration: '5 minutes',
      },
      {
        step: 8,
        instruction: 'Pour into sterilized jars and seal tightly.',
        warning: '⚠️ Use only sterilized jars to prevent bacterial growth.',
        tip: 'Leave 1/4 inch headspace in each jar.',
        duration: '5 minutes',
      },
      {
        step: 9,
        instruction:
          'Store in refrigerator for up to 3 months or process for longer storage.',
        tip: 'For longer storage, process jars in a water bath canner.',
        duration: 'N/A',
      },
    ],
    warnings: [
      '⚠️ CRITICAL: Elderberry stems, leaves, and unripe berries contain toxic compounds!',
      '⚠️ Only use fully ripe, dark purple elderberries.',
      '⚠️ Remove ALL stems, leaves, and green berries before cooking.',
      '⚠️ Hot sugar can cause severe burns - use extreme caution.',
      '⚠️ Never consume raw elderberries - they must be cooked thoroughly.',
      '⚠️ If you experience nausea, vomiting, or other symptoms after consumption, seek medical attention.',
      '⚠️ Pregnant women should avoid consuming elderberries.',
    ],
    species: ['elderberry'],
    difficulty: 'medium',
    prepTime: '30 minutes',
    cookTime: '50 minutes',
    servings: 8,
    tags: ['jam', 'preserves', 'breakfast', 'dessert'],
    safetyNotes: [
      'Only use fully ripe, dark purple elderberries',
      'Remove ALL stems, leaves, and unripe berries',
      'Cook thoroughly to destroy toxic compounds',
      'Use sterilized jars for storage',
      'Store in refrigerator and consume within 3 months',
      'Never consume raw elderberries',
    ],
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
    steps: [
      {
        step: 1,
        instruction: 'Wash wild garlic leaves thoroughly and pat dry.',
        warning:
          '⚠️ Ensure you have correctly identified wild garlic - it can be confused with toxic plants like lily of the valley.',
        tip: 'Wild garlic has a distinct garlic smell when crushed.',
        duration: '5 minutes',
      },
      {
        step: 2,
        instruction:
          'Toast pine nuts in a dry pan until golden brown, about 3-4 minutes.',
        warning:
          '⚠️ Pine nuts burn quickly - watch them carefully and stir frequently.',
        tip: 'Remove from heat as soon as they start to turn golden.',
        duration: '3-4 minutes',
      },
      {
        step: 3,
        instruction:
          'In a food processor, combine wild garlic leaves, toasted pine nuts, parmesan cheese, and garlic clove.',
        tip: 'Make sure the food processor is clean and dry.',
        duration: '2 minutes',
      },
      {
        step: 4,
        instruction: 'Pulse until finely chopped.',
        tip: "Don't over-process - you want a slightly chunky texture.",
        duration: '30 seconds',
      },
      {
        step: 5,
        instruction:
          'With the processor running, slowly drizzle in olive oil until smooth and creamy.',
        warning:
          '⚠️ Be careful when adding oil to the running processor - it can splash.',
        tip: 'Add oil in a thin, steady stream for best results.',
        duration: '1 minute',
      },
      {
        step: 6,
        instruction: 'Add lemon juice, salt, and pepper to taste.',
        tip: 'Taste and adjust seasoning - wild garlic can be quite strong.',
        duration: '1 minute',
      },
      {
        step: 7,
        instruction:
          'Transfer to a jar and cover with a thin layer of olive oil to preserve.',
        tip: 'The oil layer prevents oxidation and keeps the pesto fresh.',
        duration: '2 minutes',
      },
      {
        step: 8,
        instruction: 'Store in refrigerator for up to 1 week.',
        tip: 'Always use a clean spoon when serving to prevent contamination.',
        duration: 'N/A',
      },
      {
        step: 9,
        instruction: 'Serve with pasta, bread, or as a condiment.',
        tip: 'Wild garlic pesto is best served fresh and can be quite pungent.',
        duration: 'N/A',
      },
    ],
    warnings: [
      '⚠️ CRITICAL: Wild garlic can be confused with toxic plants like lily of the valley and death camas.',
      '⚠️ Only harvest wild garlic if you are 100% certain of identification.',
      "⚠️ Wild garlic has a distinct garlic smell when crushed - if it doesn't smell like garlic, don't use it.",
      '⚠️ Avoid harvesting from areas that may have been sprayed with pesticides.',
      '⚠️ Some people may be allergic to wild garlic - test with a small amount first.',
      '⚠️ Pregnant women should avoid consuming large amounts of wild garlic.',
    ],
    species: ['wild-garlic'],
    difficulty: 'easy',
    prepTime: '15 minutes',
    cookTime: '0 minutes',
    servings: 6,
    tags: ['pesto', 'sauce', 'italian', 'vegetarian'],
    safetyNotes: [
      'Always properly identify wild garlic before harvesting',
      'Wild garlic has a distinct garlic smell when crushed',
      'Avoid areas that may have been sprayed with pesticides',
      'Test with small amounts if you have allergies',
      'Store in refrigerator and consume within 1 week',
      "Never consume if you're unsure of identification",
    ],
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
