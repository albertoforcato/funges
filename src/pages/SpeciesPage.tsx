import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSpeciesData } from '@/data/species';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  Info,
  Leaf,
  Calendar,
  MapPin,
  ChefHat,
  AlertTriangle,
} from 'lucide-react';
import { getSeasonClass, getHabitatClass } from '@/lib/colors';

export default function SpeciesPage() {
  const { t } = useTranslation();
  const speciesData = useSpeciesData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter species based on search query and category
  const filteredSpecies = useMemo(() => {
    return speciesData.filter(species => {
      const matchesSearch =
        searchQuery === '' ||
        species.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        species.scientificName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        species.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || species.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [speciesData, searchQuery, selectedCategory]);

  const categories = [
    { value: 'all', label: t('species.allTypes'), icon: '🍃' },
    { value: 'mushroom', label: t('species.mushrooms'), icon: '🍄' },
    { value: 'plant', label: t('species.plants'), icon: '🌿' },
    { value: 'berry', label: t('species.berries'), icon: '🫐' },
    { value: 'nut', label: t('species.nuts'), icon: '🌰' },
    { value: 'flower', label: t('species.flowers'), icon: '🌸' },
  ];

  const getSeasonColor = getSeasonClass;
  const getHabitatColor = getHabitatClass;

  return (
    <div className='container mx-auto px-4 py-8 max-w-7xl'>
      {/* Header */}
      <div className='text-center mb-8'>
        <h1 className='text-4xl font-bold text-text-primary mb-4'>
          {t('species.title')}
        </h1>
        <p className='text-lg text-text-secondary max-w-2xl mx-auto'>
          {t('species.description')}
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className='mb-8 space-y-4'>
        <div className='flex flex-col sm:flex-row gap-4'>
          {/* Search Input */}
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary h-4 w-4' />
            <Input
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-10'
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className='w-full sm:w-48'>
              <SelectValue placeholder={t('species.filterByType')} />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  <span className='flex items-center gap-2'>
                    <span>{category.icon}</span>
                    {category.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className='text-sm text-text-secondary'>
          {t('common.found')} {filteredSpecies.length} {t('species.species')}
        </div>
      </div>

      {/* Species Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredSpecies.map(species => (
          <Card
            key={species.id}
            className='hover:shadow-lg transition-shadow duration-200'
          >
            <CardHeader className='pb-3'>
              <div className='flex items-start justify-between'>
                <div className='flex items-center gap-3'>
                  <span className='text-2xl'>{species.emoji}</span>
                  <div>
                    <CardTitle className='text-lg font-semibold text-text-primary'>
                      {species.name}
                    </CardTitle>
                    <p className='text-sm text-text-secondary italic'>
                      {species.scientificName}
                    </p>
                  </div>
                </div>
                <Badge variant='outline' className='capitalize'>
                  {t(`species.${species.category}s`)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className='space-y-4'>
              {/* Description */}
              <div>
                <div className='flex items-center gap-2 mb-2'>
                  <Info className='h-4 w-4 text-text-tertiary' />
                  <span className='text-sm font-medium text-text-secondary'>
                    {t('species.description')}
                  </span>
                </div>
                <p className='text-sm text-text-secondary leading-relaxed'>
                  {species.description}
                </p>
              </div>

              <Separator />

              {/* Foraging Instructions */}
              <div>
                <div className='flex items-center gap-2 mb-2'>
                  <Leaf className='h-4 w-4 text-success' />
                  <span className='text-sm font-medium text-text-secondary'>
                    {t('species.howTo')}
                  </span>
                </div>
                <p className='text-sm text-text-secondary leading-relaxed'>
                  {species.howTo}
                </p>
              </div>

              <Separator />

              {/* Season and Habitat */}
              <div className='grid grid-cols-2 gap-3'>
                {species.season && (
                  <div className='flex items-center gap-2'>
                    <Calendar className='h-4 w-4 text-primary' />
                    <Badge className={getSeasonColor(species.season)}>
                      {species.season}
                    </Badge>
                  </div>
                )}
                {species.habitat && (
                  <div className='flex items-center gap-2'>
                    <MapPin className='h-4 w-4 text-success' />
                    <Badge className={getHabitatColor(species.habitat)}>
                      {species.habitat}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Safety Notes */}
              <div className='bg-status-warning border border-status-warning-border rounded-lg p-3'>
                <div className='flex items-start gap-2'>
                  <AlertTriangle className='h-4 w-4 text-status-warning-text mt-0.5 flex-shrink-0' />
                  <div>
                    <p className='text-sm font-medium text-status-warning-text mb-1'>
                      {t('species.safetyNotes')}
                    </p>
                    <p className='text-xs text-status-warning-text'>
                      {t('species.safetyWarning')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cooking Tips */}
              <div className='bg-info/10 border border-info/30 rounded-lg p-3'>
                <div className='flex items-start gap-2'>
                  <ChefHat className='h-4 w-4 text-info mt-0.5 flex-shrink-0' />
                  <div>
                    <p className='text-sm font-medium text-info mb-1'>
                      {t('species.cookingTips')}
                    </p>
                    <p className='text-xs text-info'>
                      {t(
                        `species.${species.id}.cookingTips`,
                        'Best when fresh and properly identified.'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredSpecies.length === 0 && (
        <div className='text-center py-12'>
          <div className='text-6xl mb-4'>🔍</div>
          <h3 className='text-xl font-semibold text-text-primary mb-2'>
            {t('species.noResults')}
          </h3>
          <p className='text-text-secondary mb-4'>
            {t('species.noResultsDescription')}
          </p>
          <Button
            variant='outline'
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
          >
            {t('common.clear')}
          </Button>
        </div>
      )}
    </div>
  );
}
