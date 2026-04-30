'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Source, Layer, NavigationControl, Popup, Marker } from 'react-map-gl';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const DynamicMap = dynamic(() => import('react-map-gl').then(mod => mod.Map), {
  ssr: false,
  loading: () => <p>Loading Map...</p>,
});

export function MapViewer() {
  const [viewState, setViewState] = useState({
    longitude: 2.3522,
    latitude: 48.8566,
    zoom: 12
  });

  const [hoverInfo, setHoverInfo] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ longitude: number; latitude: number } | null>(null);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);

  useEffect(() => {
    if (userLocation) {
      setViewState(prev => ({
        ...prev,
        longitude: userLocation.longitude,
        latitude: userLocation.latitude,
        zoom: 14 // Zoom in a bit when user location is found
      }));
    }
  }, [userLocation]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
          setGeolocationError("Error getting your location: " + error.message);
        }
      );
    } else {
      console.log("Geolocation is not available in your browser.");
      setGeolocationError("Geolocation is not available in your browser.");
    }
  }, []);

  const onHover = (event: any) => {
    const { features, point: { x, y } } = event;
    const hoveredFeature = features && features[0];
    setHoverInfo(hoveredFeature ? { feature: hoveredFeature, x, y } : null);
  };

  return (
    <div className="w-full h-full relative">
      <DynamicMap
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        onMouseMove={onHover}
        interactiveLayerIds={['parcels-fill']}
      >
        <NavigationControl position="top-right" />
        {userLocation && (
          <Marker longitude={userLocation.longitude} latitude={userLocation.latitude} anchor="bottom" >
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white" />
          </Marker>
        )}
        
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

        {geolocationError && (
          <div className="absolute bottom-4 left-4 z-10 p-2 bg-red-700/80 text-white text-xs rounded">
            {geolocationError}
          </div>
        )}
      </DynamicMap>
    </div>
  );
}
