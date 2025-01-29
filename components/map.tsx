'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, LayersControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';

export default function Map() {
  // Placeholder heatmap data [latitude, longitude, intensity]
  const heatmapData: [number, number, number][] = [
    [-1.286389, 36.817223, 0.8], // Nairobi
    [-1.2921, 36.8219, 0.6],
    [-1.3001, 36.8133, 0.9],
    [-1.2801, 36.8313, 0.7],
    [-1.3201, 36.8033, 0.5],
  ];

  return (
    <MapContainer
      center={[-1.286389, 36.817223]} // Centered around Nairobi
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      {/* Layer Selection Control */}
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            attribution="© OpenTopoMap contributors"
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {/* Heatmap Layer */}
      <HeatmapLayer heatmapData={heatmapData} />
    </MapContainer>
  );
}

// Component to Add Heatmap Layer Using Leaflet.heat
function HeatmapLayer({ heatmapData }: { heatmapData: [number, number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || heatmapData.length === 0) return;

    // Ensure heatmap data is formatted correctly
    const formattedData = heatmapData.map(([lat, lng, intensity]) => [lat, lng, intensity || 0.5]);

    // Create heatmap layer
    const heatLayer = (L as any).heatLayer(formattedData, {
      radius: 20, // Adjust radius for visibility
      blur: 15,
      max: 1.0, // Ensuring visibility
    });

    heatLayer.addTo(map);

    // Cleanup function to remove the heatmap when component unmounts
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, heatmapData]);

  return null;
}
