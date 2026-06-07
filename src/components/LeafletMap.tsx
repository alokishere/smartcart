"use client";

import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import { useEffect } from "react";
import React from "react";

// ✅ Fix: Use L.Icon (capital I) — L.icon is a factory fn but typed as L.Icon
const iconMarker = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/2776/2776067.png",
  iconSize: [35, 35],
  iconAnchor: [18, 35],
});

interface LeafletMapProps {
  positions: [number, number];
  onPositionChange: (lat: number, lng: number) => void;
}

const LeafletMap = ({ positions, onPositionChange }: LeafletMapProps) => {
    const DraggableMarker:React.FC = () => {
       
       const map = useMap()
       useEffect(()=>{
        map.setView(positions as LatLngExpression,13,{animate:true})
       },[positions,map])

        return (
             <Marker
        position={positions as LatLngExpression}
        icon={iconMarker}
        draggable={true}
        eventHandlers={{
          dragend: (e: L.LeafletEvent) => {
            const marker = e.target as L.Marker;
            const { lat, lng } = marker.getLatLng();
            onPositionChange(lat,  lng);
            console.log(lat, lng) 
          },
        }}
      />
        );
    };
    
  return (
    <MapContainer
   key={`${positions[0]},${positions[1]}`}
      center={positions as LatLngExpression}
      zoom={13}
      scrollWheelZoom={true}
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "12px",
        zIndex: 0,
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DraggableMarker/>
     
    </MapContainer>
  );
};

export default LeafletMap;