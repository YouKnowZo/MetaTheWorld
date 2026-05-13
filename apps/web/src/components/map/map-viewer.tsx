'use client';

import React, { useState } from 'react';
import Map, { Source, Layer, NavigationControl, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export function MapViewer() {
  const [viewState, setViewState] = useState({
    longitude: 2.3522,
    latitude: 48.8566,
    zoom: 12
  });

  const [hoverInfo, setHoverInfo] = useState<any>(null);

  const onHover = (event: any) => {
    const { features, point: { x, y } } = event;
    const hoveredFeature = features && features[0];
    setHoverInfo(hoveredFeature ? { feature: hoveredFeature, x, y } : null);
  };

  return (
    <div className="w-full h-full relative">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        onMouseMove={onHover}
        interactiveLayerIds={['parcels-fill']}
      >
        <NavigationControl position="top-right" />
        
        {/* Mock Parcel Layer */}
        <Source
          id="parcels"
          type="geojson"
          data={{
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: { id: 'p1', tier: 'DISTRICT', owner: '0x123...' },
                geometry: {
                  type: 'Polygon',
                  coordinates: [[[2.35, 48.85], [2.36, 48.85], [2.36, 48.86], [2.35, 48.86], [2.35, 48.85]]]
                }
              }
            ]
          }}
        >
          <Layer
            id="parcels-fill"
            type="fill"
            paint={{
              'fill-color': '#088',
              'fill-opacity': 0.4
            }}
          />
          <Layer
            id="parcels-outline"
            type="line"
            paint={{
              'line-color': '#fff',
              'line-width': 2
            }}
          />
        </Source>

        {hoverInfo && (
          <div
            className="absolute z-10 p-2 bg-black/80 text-white text-xs rounded pointer-events-none"
            style={{ left: hoverInfo.x, top: hoverInfo.y }}
          >
            <div>Parcel ID: {hoverInfo.feature.properties.id}</div>
            <div>Tier: {hoverInfo.feature.properties.tier}</div>
          </div>
        )}
      </Map>
    </div>
  );
}
