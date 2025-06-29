import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Cloud,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  CloudRain,
  Eye,
  EyeOff,
  RefreshCw,
  MapPin,
} from 'lucide-react';
import {
  useWeatherForecast,
  useCurrentWeather,
  useSoilData,
} from '@/lib/query';
import { cn } from '@/lib/utils';

interface RealTimeDataOverlayProps {
  coordinates: [number, number] | null;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

interface ForagingScore {
  score: number;
  recommendation: string;
  color: string;
}

const RealTimeDataOverlay: React.FC<RealTimeDataOverlayProps> = ({
  coordinates,
  isVisible,
  onToggleVisibility,
}) => {
  const [showWeather, setShowWeather] = useState(true);
  const [showSoil, setShowSoil] = useState(true);
  const [showScore, setShowScore] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Use TanStack Query hooks
  const weatherQuery = useWeatherForecast(coordinates || [0, 0]);
  const currentWeatherQuery = useCurrentWeather(coordinates || [0, 0]);

  // For soil data, we'll use a mock region ID based on coordinates
  const mockRegionId = useMemo(() => {
    if (!coordinates) return null;
    // Create a simple region ID based on coordinates
    const lat = Math.floor(coordinates[0] * 10);
    const lng = Math.floor(coordinates[1] * 10);
    return `region_${lat}_${lng}`;
  }, [coordinates]);

  const soilQuery = useSoilData(mockRegionId || '');

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh || !coordinates) return;

    const interval = setInterval(() => {
      // TanStack Query will handle the refetch automatically
      weatherQuery.refetch();
      currentWeatherQuery.refetch();
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [autoRefresh, coordinates, weatherQuery, currentWeatherQuery]);

  const calculateForagingScore = (): ForagingScore => {
    if (!weatherQuery.data || !soilQuery.data) {
      return {
        score: 0,
        recommendation: 'No data available',
        color: 'bg-gray-500',
      };
    }

    const weather = weatherQuery.data;
    const soil = soilQuery.data;

    let score = 50; // Base score

    // Temperature factor (optimal: 15-25°C)
    const temp = weather.current?.temperature || 20;
    if (temp >= 15 && temp <= 25) {
      score += 20;
    } else if (temp >= 10 && temp <= 30) {
      score += 10;
    } else {
      score -= 10;
    }

    // Humidity factor (optimal: 60-80%)
    const humidity = weather.current?.humidity || 70;
    if (humidity >= 60 && humidity <= 80) {
      score += 15;
    } else if (humidity >= 40 && humidity <= 90) {
      score += 5;
    } else {
      score -= 10;
    }

    // Precipitation factor
    const precipitation = weather.current?.precipitation || 0;
    if (precipitation < 5) {
      score += 10; // Light rain is good
    } else if (precipitation > 20) {
      score -= 15; // Heavy rain is bad
    }

    // Soil moisture factor
    const soilMoisture = soil.moisture || 50;
    if (soilMoisture >= 40 && soilMoisture <= 70) {
      score += 15;
    } else if (soilMoisture >= 20 && soilMoisture <= 80) {
      score += 5;
    } else {
      score -= 10;
    }

    // Determine recommendation and color
    let recommendation = '';
    let color = '';

    if (score >= 80) {
      recommendation = 'Excellent foraging conditions!';
      color = 'bg-green-500';
    } else if (score >= 60) {
      recommendation = 'Good foraging conditions';
      color = 'bg-blue-500';
    } else if (score >= 40) {
      recommendation = 'Moderate foraging conditions';
      color = 'bg-yellow-500';
    } else {
      recommendation = 'Poor foraging conditions';
      color = 'bg-red-500';
    }

    return { score: Math.max(0, Math.min(100, score)), recommendation, color };
  };

  const foragingScore = calculateForagingScore();

  if (!isVisible) {
    return (
      <Button
        onClick={onToggleVisibility}
        variant='outline'
        size='sm'
        className='fixed top-4 right-4 z-50'
      >
        <Eye className='w-4 h-4 mr-2' />
        Show Data
      </Button>
    );
  }

  return (
    <div className='fixed top-4 right-4 z-50 w-80'>
      <Card className='shadow-lg'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-lg flex items-center'>
              <MapPin className='w-4 h-4 mr-2' />
              Real-Time Data
            </CardTitle>
            <div className='flex items-center gap-2'>
              <Button
                onClick={() => {
                  weatherQuery.refetch();
                  currentWeatherQuery.refetch();
                  soilQuery.refetch();
                }}
                variant='ghost'
                size='sm'
                disabled={
                  weatherQuery.isFetching ||
                  currentWeatherQuery.isFetching ||
                  soilQuery.isFetching
                }
              >
                <RefreshCw
                  className={cn(
                    'w-4 h-4',
                    (weatherQuery.isFetching ||
                      currentWeatherQuery.isFetching ||
                      soilQuery.isFetching) &&
                      'animate-spin'
                  )}
                />
              </Button>
              <Button onClick={onToggleVisibility} variant='ghost' size='sm'>
                <EyeOff className='w-4 h-4' />
              </Button>
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <Switch
              id='auto-refresh'
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
            <Label htmlFor='auto-refresh' className='text-sm'>
              Auto-refresh (5min)
            </Label>
          </div>
        </CardHeader>

        <CardContent className='space-y-4'>
          {/* Error states */}
          {(weatherQuery.error ||
            currentWeatherQuery.error ||
            soilQuery.error) && (
            <div className='text-red-500 text-sm p-2 bg-red-50 rounded'>
              Error loading data. Please try again.
            </div>
          )}

          {/* Loading states */}
          {(weatherQuery.isLoading ||
            currentWeatherQuery.isLoading ||
            soilQuery.isLoading) && (
            <div className='text-gray-500 text-sm p-2 bg-gray-50 rounded'>
              Loading data...
            </div>
          )}

          {/* Weather Data */}
          {showWeather && weatherQuery.data && (
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <h3 className='font-semibold flex items-center'>
                  <Cloud className='w-4 h-4 mr-2' />
                  Weather
                </h3>
                <Button
                  onClick={() => setShowWeather(false)}
                  variant='ghost'
                  size='sm'
                >
                  Hide
                </Button>
              </div>

              <div className='grid grid-cols-2 gap-2 text-sm'>
                <div className='flex items-center'>
                  <Thermometer className='w-4 h-4 mr-2 text-red-500' />
                  <span>
                    {weatherQuery.data.current?.temperature || 'N/A'}°C
                  </span>
                </div>
                <div className='flex items-center'>
                  <Droplets className='w-4 h-4 mr-2 text-blue-500' />
                  <span>{weatherQuery.data.current?.humidity || 'N/A'}%</span>
                </div>
                <div className='flex items-center'>
                  <Wind className='w-4 h-4 mr-2 text-gray-500' />
                  <span>
                    {weatherQuery.data.current?.windSpeed || 'N/A'} km/h
                  </span>
                </div>
                <div className='flex items-center'>
                  <CloudRain className='w-4 h-4 mr-2 text-blue-600' />
                  <span>
                    {weatherQuery.data.current?.precipitation || 'N/A'} mm
                  </span>
                </div>
              </div>

              {weatherQuery.data.forecast &&
                weatherQuery.data.forecast.length > 0 && (
                  <div className='mt-2'>
                    <p className='text-xs text-gray-600 mb-1'>24h Forecast:</p>
                    <div className='flex gap-1'>
                      {weatherQuery.data.forecast
                        .slice(0, 4)
                        .map((day, index) => (
                          <Badge
                            key={index}
                            variant='outline'
                            className='text-xs'
                          >
                            {day.temperature}°C
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* Soil Data */}
          {showSoil && soilQuery.data && (
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <h3 className='font-semibold'>Soil Conditions</h3>
                <Button
                  onClick={() => setShowSoil(false)}
                  variant='ghost'
                  size='sm'
                >
                  Hide
                </Button>
              </div>

              <div className='grid grid-cols-2 gap-2 text-sm'>
                <div>
                  <span className='text-gray-600'>Moisture:</span>
                  <div className='flex items-center'>
                    <div className='w-16 bg-gray-200 rounded-full h-2 mr-2'>
                      <div
                        className='bg-blue-500 h-2 rounded-full'
                        style={{ width: `${soilQuery.data.moisture || 0}%` }}
                      />
                    </div>
                    <span>{soilQuery.data.moisture || 'N/A'}%</span>
                  </div>
                </div>
                <div>
                  <span className='text-gray-600'>pH Level:</span>
                  <span className='ml-2'>{soilQuery.data.ph || 'N/A'}</span>
                </div>
                <div>
                  <span className='text-gray-600'>Type:</span>
                  <span className='ml-2'>{soilQuery.data.type || 'N/A'}</span>
                </div>
                <div>
                  <span className='text-gray-600'>Nutrients:</span>
                  <span className='ml-2'>
                    N:{soilQuery.data.nutrients?.nitrogen || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Foraging Score */}
          {showScore && (
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <h3 className='font-semibold flex items-center'>
                  <Sun className='w-4 h-4 mr-2' />
                  Foraging Score
                </h3>
                <Button
                  onClick={() => setShowScore(false)}
                  variant='ghost'
                  size='sm'
                >
                  Hide
                </Button>
              </div>

              <div className='text-center'>
                <div
                  className={cn(
                    'w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2',
                    foragingScore.color
                  )}
                >
                  {foragingScore.score}
                </div>
                <p className='text-sm text-gray-600'>
                  {foragingScore.recommendation}
                </p>
              </div>
            </div>
          )}

          {/* Show buttons for hidden sections */}
          <div className='flex gap-2 pt-2 border-t'>
            {!showWeather && (
              <Button
                onClick={() => setShowWeather(true)}
                variant='outline'
                size='sm'
              >
                Show Weather
              </Button>
            )}
            {!showSoil && (
              <Button
                onClick={() => setShowSoil(true)}
                variant='outline'
                size='sm'
              >
                Show Soil
              </Button>
            )}
            {!showScore && (
              <Button
                onClick={() => setShowScore(true)}
                variant='outline'
                size='sm'
              >
                Show Score
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeDataOverlay;
