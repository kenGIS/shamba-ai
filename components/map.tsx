'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';

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

      {/* Heatmap Layer Component */}
      <HeatmapLayer heatmapData={heatmapData} />
    </MapContainer>
  );
}

// Component to Add Heatmap Layer Using Leaflet.heat
function HeatmapLayer({ heatmapData }: { heatmapData: number[][] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || heatmapData.length === 0) return;

    const heatLayer = L.heatLayer(heatmapData, {
      radius: 25, // Adjust radius as needed
      blur: 15,
      maxZoom: 17,
    });

    heatLayer.addTo(map);

    // Cleanup function to remove the heatmap when component unmounts
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, heatmapData]);

  return null;
}
