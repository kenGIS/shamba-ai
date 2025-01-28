'use client';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Map() {
  return (
    <MapContainer
      center={[-1.2921, 36.8219]} // Centered on Nairobi, Kenya
      zoom={8}
      className="h-[70vh] lg:h-[80vh] w-full rounded-xl"
    >
      {/* Placeholder base map layer */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );
}
