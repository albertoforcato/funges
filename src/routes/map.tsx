import { createFileRoute } from '@tanstack/react-router';
import { AdvancedMap } from '@/components/AdvancedMap';
import { useMapStore } from '@/store/mapStore';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Target } from 'lucide-react';

export const Route = createFileRoute('/map')({
  component: MapPage,
});

function MapPage() {
  const {
    center,
    zoom,
    foragingSpots,
    selectedSpot,
    isLoading,
    error,
    showSearch,
    showUserLocation,
    setSelectedSpot,
    fetchNearbySpots,
    getUserLocation,
    clearError,
  } = useMapStore();

  // Fetch nearby spots when component mounts
  useEffect(() => {
    if (center) {
      fetchNearbySpots(center, 10); // 10km radius
    }
  }, [center, fetchNearbySpots]);

  const handleLocationSelect = (location: {
    lng: number;
    lat: number;
    address?: string;
  }) => {
    console.log('Selected location:', location);
    // You can add logic here to handle location selection
  };

  const handleSpotClick = (spot: any) => {
    setSelectedSpot(spot);
  };

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Main Map Area */}
      <div className='flex-1 relative'>
        <AdvancedMap
          center={center}
          zoom={zoom}
          className='h-full'
          showSearch={showSearch}
          showUserLocation={showUserLocation}
          onLocationSelect={handleLocationSelect}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className='absolute inset-0 bg-black/20 flex items-center justify-center z-20'>
            <div className='bg-white rounded-lg p-6 shadow-lg'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2'></div>
              <p className='text-gray-600'>Loading map data...</p>
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className='absolute top-4 left-4 right-4 z-20'>
            <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
              <div className='flex items-center justify-between'>
                <p className='text-red-700'>{error}</p>
                <Button variant='ghost' size='sm' onClick={clearError}>
                  ×
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className='w-80 bg-white border-l border-gray-200 overflow-y-auto'>
        <div className='p-4'>
          <h2 className='text-xl font-semibold mb-4'>Foraging Spots</h2>

          {/* User Location Button */}
          <Button
            onClick={getUserLocation}
            className='w-full mb-4'
            variant='outline'
          >
            <Target className='w-4 h-4 mr-2' />
            Get My Location
          </Button>

          {/* Spots List */}
          <div className='space-y-3'>
            {foragingSpots.map(spot => (
              <Card
                key={spot.id}
                className={`cursor-pointer transition-colors ${
                  selectedSpot?.id === spot.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleSpotClick(spot)}
              >
                <CardHeader className='pb-2'>
                  <div className='flex items-start justify-between'>
                    <CardTitle className='text-sm font-medium'>
                      {spot.name}
                    </CardTitle>
                    <Badge
                      variant={
                        spot.type === 'mushroom'
                          ? 'default'
                          : spot.type === 'berry'
                            ? 'secondary'
                            : spot.type === 'herb'
                              ? 'outline'
                              : 'destructive'
                      }
                      className='text-xs'
                    >
                      {spot.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className='pt-0'>
                  <p className='text-sm text-gray-600 mb-2'>
                    {spot.description}
                  </p>
                  <div className='flex items-center gap-4 text-xs text-gray-500'>
                    <div className='flex items-center gap-1'>
                      <Calendar className='w-3 h-3' />
                      <span>{spot.season.join(', ')}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <MapPin className='w-3 h-3' />
                      <span>{Math.round(spot.confidence * 100)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {foragingSpots.length === 0 && !isLoading && (
            <div className='text-center py-8 text-gray-500'>
              <MapPin className='w-8 h-8 mx-auto mb-2 text-gray-300' />
              <p>No foraging spots found nearby</p>
              <p className='text-sm'>
                Try moving the map or getting your location
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
