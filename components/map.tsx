'use client';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';

const { BaseLayer, Overlay } = LayersControl;

export default function Map() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading map...</div>;
  }

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

          {/* Dummy Heatmap Layer */}
          <Overlay name="Thematic Heatmap">
            <TileLayer
              url="https://stamen-tiles.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://stamen.com/">Stamen Design</a>'
              opacity={0.7} // Slight transparency for overlay effect
            />
          </Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
}
