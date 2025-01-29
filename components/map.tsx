'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";
import 'leaflet/dist/leaflet.css';

export default function Map() {
  // Placeholder heatmap data (latitude, longitude, intensity)
  const heatmapData = [
    { lat: -1.286389, lng: 36.817223, intensity: 0.8 }, // Nairobi
    { lat: -1.2921, lng: 36.8219, intensity: 0.6 }, // Another point in Nairobi
    { lat: -1.3001, lng: 36.8133, intensity: 0.9 }, // Another point
    { lat: -1.2801, lng: 36.8313, intensity: 0.7 }, // Another point
    { lat: -1.3201, lng: 36.8033, intensity: 0.5 }, // Another point
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

      {/* Heatmap Layer */}
      <HeatmapLayer
        fitBoundsOnLoad
        fitBoundsOnUpdate
        points={heatmapData}
        longitudeExtractor={(p) => p.lng}
        latitudeExtractor={(p) => p.lat}
        intensityExtractor={(p) => p.intensity}
        radius={20} // Heatmap point radius
        blur={25} // Blurring effect
        max={1} // Max intensity
      />
    </MapContainer>
  );
}
