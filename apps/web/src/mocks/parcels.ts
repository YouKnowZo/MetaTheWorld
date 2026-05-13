export const MOCK_PARCELS = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { 
        id: 'p1', 
        tier: 'DISTRICT', 
        owner: '0x1234567890123456789012345678901234567890',
        city: 'Paris',
        country: 'France'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[2.35, 48.85], [2.36, 48.85], [2.36, 48.86], [2.35, 48.86], [2.35, 48.85]]]
      }
    },
    {
      type: 'Feature',
      properties: { 
        id: 'p2', 
        tier: 'PLOT', 
        owner: '0x0987654321098765432109876543210987654321',
        city: 'Paris',
        country: 'France'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[2.365, 48.855], [2.375, 48.855], [2.375, 48.865], [2.365, 48.865], [2.365, 48.855]]]
      }
    }
  ]
};
