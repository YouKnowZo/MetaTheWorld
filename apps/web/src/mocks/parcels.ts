export const MOCK_PARCELS = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'p1',
        name: 'Eiffel Tower View',
        description: 'A prime parcel with an iconic view of the Eiffel Tower.',
        tier: 'DISTRICT',
        owner: '0x1234567890123456789012345678901234567890',
        city: 'Paris',
        country: 'France',
        price: 1000000
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
        name: 'Small Parisian Plot',
        description: 'A cozy plot in the heart of Paris, perfect for a boutique.',
        tier: 'PLOT',
        owner: '0x0987654321098765432109876543210987654321',
        city: 'Paris',
        country: 'France',
        price: 500000
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[2.365, 48.855], [2.375, 48.855], [2.375, 48.865], [2.365, 48.865], [2.365, 48.855]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'p3',
        name: 'New York Skyscraper Lot',
        description: 'High-rise potential in a bustling metropolitan area.',
        tier: 'DISTRICT',
        owner: '0xabcdef1234567890abcdef1234567890abcdef12',
        city: 'New York',
        country: 'USA',
        price: 2500000
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-74.01, 40.70], [-74.00, 40.70], [-74.00, 40.71], [-74.01, 40.71], [-74.01, 40.70]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'p4',
        name: 'Tokyo Residential Area',
        description: 'A quiet residential plot in a vibrant Tokyo neighborhood.',
        tier: 'PLOT',
        owner: '0x1234567890abcdef1234567890abcdef12345678',
        city: 'Tokyo',
        country: 'Japan',
        price: 800000
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[139.70, 35.60], [139.71, 35.60], [139.71, 35.61], [139.70, 35.61], [139.70, 35.60]]]
      }
    }
  ]
};
