'use client';

import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import HeatmapLayer from 'react-leaflet-heat-layer';
import 'leaflet/dist/leaflet.css';

export default function Map() {
  // Placeholder heatmap data [latitude, longitude, intensity]
  const heatmapData = [
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
      {/* Base Map Layer */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      {/* Fixed Heatmap Layer */}
      <HeatmapLayer
        points={heatmapData}
        longitudeExtractor={(m) => m[1]}
        latitudeExtractor={(m) => m[0]}
        intensityExtractor={(m) => m[2]}
        radius={20} // Heatmap point radius
        blur={15} // Blurring effect
        max={1.0} // Max intensity
      />
    </MapContainer>
  );
}
