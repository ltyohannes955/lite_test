import React, { useRef } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  zoom: number;
  h: number;
  destination: any;
  origin: any;
}

const MapComponent: React.FC<MapProps> = ({ zoom, h, origin, destination }) => {
  const mapRefi: any = useRef();

  const center = [9.010947259288999, 38.761515309323606];

  const markerIcon = new L.Icon({
    iconUrl: "/location.svg",
    iconSize: [40, 40],
    iconAnchor: [17, 46], //[left/right, top/bottom]
    popupAnchor: [0, -46], //[left/right, top/bottom]
  });
  const originIcon = new L.Icon({
    iconUrl: "/bluelocation.svg",
    iconSize: [40, 40],
    iconAnchor: [17, 46], //[left/right, top/bottom]
    popupAnchor: [0, -46], //[left/right, top/bottom]
  });

  return (
    <>
      <MapContainer
        center={center as any}
        zoom={zoom}
        ref={mapRefi}
        style={{ height: `${h}vh`, width: "100%" }}
      >
        {origin.lat && origin.lon && (
          <Marker icon={originIcon} position={[origin.lat, origin.lon]} />
        )}
        {destination.lat && destination.lon && (
          <Marker
            icon={markerIcon}
            position={[destination.lat, destination.lon]}
          />
        )}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // attribution={osm.maptiler.attribution}
        />
      </MapContainer>
    </>
  );
};

export default MapComponent;
