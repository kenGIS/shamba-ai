'use client';
import { MapContainer, TileLayer, WMSTileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Map() {
  return (
    <MapContainer
      center={[-1.2921, 36.8219]}
      zoom={8}
      className="h-[70vh] lg:h-[80vh] w-full rounded-xl"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <WMSTileLayer
        url={process.env.NEXT_PUBLIC_GEOSERVER_URL}
        layers="shamba:base_satellite"
        format="image/png"
        transparent={true}
      />
    </MapContainer>
  );
}
