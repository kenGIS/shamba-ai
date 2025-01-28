'use client';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';
import HeatmapLayer from "react-leaflet-heatmap-layer";

const { BaseLayer, Overlay } = LayersControl;

export default function Map() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading map...</div>;
  }

  // Example heatmap data
  const heatmapData = [
    { lat: -1.064, lng: 37.134, intensity: 1 },
    { lat: -1.065, lng: 37.135, intensity: 0.8 },
    { lat: -1.066, lng: 37.136, intensity: 0.6 },
  ];

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: '#111',
        position: 'relative',
      }}
    >
      <MapContainer
        center={[-1.065, 37.135]} // Coordinates for Kilimambogo area
        zoom={13} // Zoom level
        style={{ height: '100%', width: '100%' }}
      >
        <LayersControl position="topright">
          {/* OpenStreetMap Basemap */}
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </BaseLayer>

          {/* Google Earth Imagery (Satellite Only) */}
          <BaseLayer name="Google Earth Imagery">
            <TileLayer
              url="http://www.google.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}"
              attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
            />
          </BaseLayer>

          {/* Google Earth Hybrid (Satellite + Labels) */}
          <BaseLayer name="Google Earth Hybrid">
            <TileLayer
              url="http://www.google.cn/maps/vt?lyrs=y&x={x}&y={y}&z={z}"
              attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
            />
          </BaseLayer>

          {/* Simulated Heatmap */}
          <Overlay name="Simulated Heatmap">
            <HeatmapLayer
              fitBoundsOnLoad
              fitBoundsOnUpdate
              points={heatmapData}
              longitudeExtractor={(point) => point.lng}
              latitudeExtractor={(point) => point.lat}
              intensityExtractor={(point) => point.intensity}
            />
          </Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
}
