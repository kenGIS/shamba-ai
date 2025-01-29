'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, LayersControl, LayerGroup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';

export default function Map() {
  // Expanded heatmap data to cover a larger area
  const heatmapData: [number, number, number][] = [
    [-1.286389, 36.817223, 0.8], // Nairobi
    [-1.2921, 36.8219, 0.6], // Nairobi West
    [-1.3001, 36.8133, 0.9], // Lavington
    [-1.2801, 36.8313, 0.7], // Parklands
    [-1.3201, 36.8033, 0.5], // Karen
    [-1.2501, 36.8453, 0.4], // Runda
    [-1.3101, 36.7853, 0.8], // Ngong
    [-1.3351, 36.7703, 0.6], // Kikuyu
    [-1.3651, 36.7353, 0.7], // Limuru
    [-1.2501, 36.9053, 0.9], // Ruiru
    [-1.2801, 36.9513, 0.6], // Thika
  ];

  return (
    <MapContainer
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      {/* Auto-fit map to heatmap bounds */}
      <FitMapToBounds heatmapData={heatmapData} />

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

        {/* Heatmap Layer Toggle */}
        <LayersControl.Overlay name="Heatmap">
          <LayerGroup>
            <HeatmapLayer heatmapData={heatmapData} />
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
}

// Component to Auto-Fit Map Bounds to Heatmap Data
function FitMapToBounds({ heatmapData }: { heatmapData: [number, number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || heatmapData.length === 0) return;

    // Calculate bounds from heatmap data points
    const bounds = L.latLngBounds(heatmapData.map(([lat, lng]) => [lat, lng]));
    map.fitBounds(bounds, { padding: [20, 20] });

  }, [map, heatmapData]);

  return null;
}

// Component to Add/Remove Heatmap Layer Using Leaflet.heat
function HeatmapLayer({ heatmapData }: { heatmapData: [number, number, number][] }) {
  const map = useMap();
  const [heatLayer, setHeatLayer] = useState<L.Layer | null>(null);
  const [isHeatmapVisible, setIsHeatmapVisible] = useState(true); // Track visibility

  useEffect(() => {
    if (!map || heatmapData.length === 0) return;

    // Ensure heatmap data is formatted correctly
    const formattedData = heatmapData.map(([lat, lng, intensity]) => [lat, lng, intensity || 0.5]);

    // Create heatmap layer
    const newHeatLayer = (L as any).heatLayer(formattedData, {
      radius: 30,  // Increase for visibility
      blur: 25,    // Adjust blur for smoothness
      maxZoom: 15, // Ensure it appears at different zoom levels
      minOpacity: 0.5, // Ensures heatmap visibility even at low intensity
    });

    setHeatLayer(newHeatLayer);
    if (isHeatmapVisible) newHeatLayer.addTo(map);

    // Cleanup function to remove the heatmap when component unmounts
    return () => {
      if (map.hasLayer(newHeatLayer)) {
        map.removeLayer(newHeatLayer);
      }
    };
  }, [map, heatmapData, isHeatmapVisible]);

  // Listen for changes in `LayersControl` to toggle heatmap visibility
  useEffect(() => {
    const handleOverlayAdd = (e: L.LayersControlEvent) => {
      if (e.name === 'Heatmap') {
        setIsHeatmapVisible(true);
        if (heatLayer) heatLayer.addTo(map);
      }
    };

    const handleOverlayRemove = (e: L.LayersControlEvent) => {
      if (e.name === 'Heatmap') {
        setIsHeatmapVisible(false);
        if (heatLayer) map.removeLayer(heatLayer);
      }
    };

    map.on('overlayadd', handleOverlayAdd);
    map.on('overlayremove', handleOverlayRemove);

    return () => {
      map.off('overlayadd', handleOverlayAdd);
      map.off('overlayremove', handleOverlayRemove);
    };
  }, [map, heatLayer]);

  return null;
}
