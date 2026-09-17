"use client";

import {MapContainer, Marker, Popup} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L, {Icon} from "leaflet";

import MapTilerLayer from "./MapTilerLayer";

import type {MarkerPosition} from "@/types/types";
import {useEffect, useRef} from "react";
import {Card} from "../ui/card";

const countryBounds = L.latLngBounds([
  [39.65, 19.2667],
  [42.6667, 21.0667]
]);

const defaultIcon = new Icon({
  iconUrl: "/marker-icon.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

export default function SingleListingMarker({markerPosition}: MarkerPosition) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <Card className="relative h-140 pt-0 shadow-xl">
      <div className="absolute w-full h-140 overflow-hidden" ref={containerRef}>
        <MapContainer
          center={[41.3275, 19.8187]}
          zoom={8}
          minZoom={7}
          zoomControl={false}
          maxBounds={countryBounds}
          maxBoundsViscosity={1.0}
          className="h-full w-full z-0"
          ref={mapRef}
        >
          <MapTilerLayer />

          {markerPosition && (
            <Marker
              position={[markerPosition.lat, markerPosition.lng]}
              icon={defaultIcon}
            >
              <Popup>
                This marker is at:
                <br />
                Lat: {markerPosition.lat.toFixed(4)}, Lng:
                {markerPosition.lng.toFixed(4)}
              </Popup>
            </Marker>
          )}

          {markerPosition && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`http://maps.google.com/?q=${markerPosition.lat},${markerPosition.lng}`}
              className="absolute bottom-8 left-8 z-400 -mt-12 max-w-56"
            >
              <div className="text-xl bg-white p-1.5 rounded-sm border shadow-sm font-medium text-center text-slate-800">
                Open in Google Maps
              </div>
            </a>
          )}
        </MapContainer>
      </div>
    </Card>
  );
}
