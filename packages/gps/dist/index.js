"use strict";
// GPS package - standalone implementation
// Provides GPS utilities and hooks for Meta The World geolocation features
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGPSLocation = useGPSLocation;
exports.calculateDistance = calculateDistance;
exports.useNearbyLands = useNearbyLands;
// Browser Geolocation API implementation
function useGPSLocation() {
    let location = null;
    let error = null;
    let loading = true;
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                altitude: position.coords.altitude || undefined,
                accuracy: position.coords.accuracy,
            };
            loading = false;
        }, (err) => {
            error = err.message;
            loading = false;
        });
    }
    else {
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
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
// Find nearby lands within a specified radius
function useNearbyLands(userLocation, allLands = [], radius = 500) {
    const lands = [];
    let loading = false;
    let error = null;
    if (!userLocation) {
        error = 'User location not available';
        return { lands, loading, error };
    }
    try {
        allLands.forEach(land => {
            const distance = calculateDistance(userLocation.latitude, userLocation.longitude, land.coordinates.lat, land.coordinates.lng);
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
    }
    catch (err) {
        error = err instanceof Error ? err.message : 'Error calculating nearby lands';
    }
    return {
        lands,
        loading,
        error
    };
}
//# sourceMappingURL=index.js.map