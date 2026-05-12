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
export declare function useGPSLocation(): {
    location: null;
    error: string | null;
    loading: boolean;
};
export declare function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
export declare function useNearbyLands(userLocation: GPSLocation | null, allLands?: Land[], radius?: number): {
    lands: Land[];
    loading: boolean;
    error: string | null;
};
//# sourceMappingURL=index.d.ts.map