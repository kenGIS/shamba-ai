'use client';

import React, { useEffect, useState } from 'react';
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
        {/* Base Map Options */}
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

        {/* Heatmap Layer */}
        <LayersControl.Overlay checked name="Heatmap">
          <HeatmapLayer heatmapData={heatmapData} />
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
}

// Component to Add Heatmap Layer Using Leaflet.heat
function HeatmapLayer({ heatmapData }: { heatmapData: [number, number, number][] }) {
  const map = useMap();
  const [heatLayer, setHeatLayer] = useState<L.Layer | null>(null);

  useEffect(() => {
    if (!map || heatmapData.length === 0) return;

    // Ensure heatmap data is formatted correctly
    const formattedData = heatmapData.map(([lat, lng, intensity]) => [lat, lng, intensity || 0.5]);

    // Remove existing heatmap before adding a new one (to prevent duplicates)
    if (heatLayer) {
      map.removeLayer(heatLayer);
    }

    // Create heatmap layer
    const newHeatLayer = (L as any).heatLayer(formattedData, {
      radius: 30,  // Increase for visibility
      blur: 25,    // Adjust blur for smoothness
      maxZoom: 15, // Ensure it appears at different zoom levels
      minOpacity: 0.5, // Ensures heatmap visibility even at low intensity
    });

    // Add new heatmap to the map
    newHeatLayer.addTo(map);
    setHeatLayer(newHeatLayer);

    // Cleanup function to remove the heatmap when component unmounts
    return () => {
      if (map.hasLayer(newHeatLayer)) {
        map.removeLayer(newHeatLayer);
      }
    };
  }, [map, heatmapData]);

  return null;
}
