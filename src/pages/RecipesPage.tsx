import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecipesData } from '@/data/recipes';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Users, ChefHat, Filter } from 'lucide-react';

export default function RecipesPage() {
  const { t } = useTranslation();
  const recipes = useRecipesData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories from species data
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    recipes.forEach(recipe => {
      recipe.species.forEach(species => {
        // Map species to categories (this would ideally come from species data)
        if (
          [
            'chanterelle',
            'morel',
            'porcini',
            'oysterMushroom',
            'shiitake',
          ].includes(species)
        ) {
          categorySet.add('mushroom');
        } else if (
          [
            'elderberry',
            'blackberry',
            'raspberry',
            'blueberry',
            'strawberry',
          ].includes(species)
        ) {
          categorySet.add('berry');
        } else if (
          [
            'nettle',
            'wildGarlic',
            'dandelion',
            'wildMint',
            'chickweed',
            'plantain',
          ].includes(species)
        ) {
          categorySet.add('plant');
        } else if (['hazelnut', 'walnut', 'chestnut'].includes(species)) {
          categorySet.add('nut');
        }
      });
    });
    return Array.from(categorySet).sort();
  }, [recipes]);

  // Filter recipes based on search query and category
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch =
        searchQuery === '' ||
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some(tag =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        recipe.ingredients.some(ingredient =>
          ingredient.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === 'all' ||
        recipe.species.some(species => {
          if (selectedCategory === 'mushroom') {
            return [
              'chanterelle',
              'morel',
              'porcini',
              'oysterMushroom',
              'shiitake',
            ].includes(species);
          } else if (selectedCategory === 'berry') {
            return [
              'elderberry',
              'blackberry',
              'raspberry',
              'blueberry',
              'strawberry',
            ].includes(species);
          } else if (selectedCategory === 'plant') {
            return [
              'nettle',
              'wildGarlic',
              'dandelion',
              'wildMint',
              'chickweed',
              'plantain',
            ].includes(species);
          } else if (selectedCategory === 'nut') {
            return ['hazelnut', 'walnut', 'chestnut'].includes(species);
          }
          return false;
        });

      return matchesSearch && matchesCategory;
    });
  }, [recipes, searchQuery, selectedCategory]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-success/10 text-success';
      case 'medium':
        return 'bg-warning/10 text-warning';
      case 'hard':
        return 'bg-error/10 text-error';
      default:
        return 'bg-background-secondary text-text-primary';
    }
  };

  return (
    <div className='recipes-page max-w-7xl mx-auto px-4 py-8'>
      {/* Header */}
      <div className='text-center mb-8'>
        <h1 className='text-4xl font-bold text-text-primary mb-4'>
          {t('recipes.title')}
        </h1>
        <p className='text-lg text-text-secondary max-w-2xl mx-auto'>
          {t('recipes.description')}
        </p>
      </div>

      {/* Search and Filters */}
      <div className='mb-8 space-y-4'>
        {/* Search Bar */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary h-4 w-4' />
          <Input
            type='text'
            placeholder='Search recipes, ingredients, or tags...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>

        {/* Category Filters */}
        <div className='flex flex-wrap gap-2'>
          <span className='flex items-center gap-2 text-sm font-medium text-text-primary'>
            <Filter className='h-4 w-4' />
            {t('recipes.filterBy')}:
          </span>
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setSelectedCategory('all')}
          >
            {t('recipes.all')}
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size='sm'
              onClick={() => setSelectedCategory(category)}
            >
              {t(`recipes.${category}`)}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        <div className='text-sm text-text-secondary'>
          {filteredRecipes.length} recipe
          {filteredRecipes.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Recipes Grid */}
      {filteredRecipes.length === 0 ? (
        <div className='text-center py-12'>
          <ChefHat className='h-12 w-12 text-text-tertiary mx-auto mb-4' />
          <h3 className='text-lg font-medium text-text-primary mb-2'>
            No recipes found
          </h3>
          <p className='text-text-secondary'>
            Try adjusting your search terms or filters to find more recipes.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredRecipes.map(recipe => (
            <Card
              key={recipe.id}
              className='h-full flex flex-col hover:shadow-lg transition-shadow'
            >
              <CardHeader className='pb-3'>
                <div className='flex items-start justify-between'>
                  <CardTitle className='text-lg line-clamp-2'>
                    {recipe.title}
                  </CardTitle>
                  <Badge className={getDifficultyColor(recipe.difficulty)}>
                    {recipe.difficulty}
                  </Badge>
                </div>
                <CardDescription className='line-clamp-2'>
                  {recipe.ingredients.slice(0, 3).join(', ')}...
                </CardDescription>
              </CardHeader>

              <CardContent className='flex-1 flex flex-col'>
                {/* Recipe Stats */}
                <div className='flex items-center gap-4 text-sm text-text-secondary mb-4'>
                  <div className='flex items-center gap-1'>
                    <Clock className='h-4 w-4' />
                    <span>{recipe.prepTime}</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Users className='h-4 w-4' />
                    <span>{recipe.servings} servings</span>
                  </div>
                </div>

                {/* Tags */}
                <div className='flex flex-wrap gap-1 mb-4'>
                  {recipe.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant='secondary' className='text-xs'>
                      {tag}
                    </Badge>
                  ))}
                  {recipe.tags.length > 3 && (
                    <Badge variant='secondary' className='text-xs'>
                      +{recipe.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Species */}
                <div className='flex flex-wrap gap-1 mb-4'>
                  {recipe.species.map(species => (
                    <Badge key={species} variant='outline' className='text-xs'>
                      {species}
                    </Badge>
                  ))}
                </div>

                {/* View Recipe Button */}
                <Button className='mt-auto' variant='outline'>
                  View Recipe
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
