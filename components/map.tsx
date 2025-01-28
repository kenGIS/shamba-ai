'use client';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';

const { BaseLayer } = LayersControl;

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

          {/* Google Earth Imagery Basemap */}
          <BaseLayer name="Google Earth Imagery">
            <TileLayer
              url="http://www.google.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}"
              attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
            />
          </BaseLayer>
        </LayersControl>
      </MapContainer>
    </div>
  );
}
