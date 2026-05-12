// GPS package - standalone implementation
// Provides GPS utilities and hooks for Meta The World geolocation features

export interface GPSLocation {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
}

export interface Land {
  id: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  name: string;
  distance?: number;
}

// Browser Geolocation API implementation
export function useGPSLocation() {
  let location: GPSLocation | null = null;
  let error: string | null = null;
  let loading = true;

  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position: any) => {
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude || undefined,
          accuracy: position.coords.accuracy,
        };
        loading = false;
      },
      (err: any) => {
        error = err.message;
        loading = false;
      }
    );
  } else {
    error = 'Geolocation is not supported by this browser';
    loading = false;
  }

  return {
    location,
    error,
    loading
  };
}

// Calculate distance between two coordinates in kilometers
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find nearby lands within a specified radius
export function useNearbyLands(userLocation: GPSLocation | null, allLands: Land[] = [], radius: number = 500) {
  const lands: Land[] = [];
  let loading = false;
  let error: string | null = null;

  if (!userLocation) {
    error = 'User location not available';
    return { lands, loading, error };
  }

  try {
    allLands.forEach(land => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        land.coordinates.lat,
        land.coordinates.lng
      );

      // Convert radius from meters to kilometers
      const radiusInKm = radius / 1000;

      if (distance <= radiusInKm) {
        lands.push({
          ...land,
          distance
        });
      }
    });

    // Sort by distance
    lands.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  } catch (err) {
    error = err instanceof Error ? err.message : 'Error calculating nearby lands';
  }

  return {
    lands,
    loading,
    error
  };
}