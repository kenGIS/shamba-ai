'use client';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

const Map = React.memo(() => {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: '#111',
      }}
    >
      <MapContainer
        center={[-1.2921, 36.8219]} // Nairobi, Kenya
        zoom={8}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </div>
  );
});

export default Map;
