"use client";

import {toast} from "sonner";
import {MapContainer, Marker, Popup, useMapEvents} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L, {Icon} from "leaflet";

import MapTilerLayer from "./MapTilerLayer";

import type {MarkerPosition} from "@/types/types";
import {useEffect, useRef} from "react";
import {Card} from "../ui/card";

type MarkerPositionExtended = MarkerPosition & {
  setMarkerPosition: React.Dispatch<React.SetStateAction<L.LatLng | null>>;
};

type MapEventsProps = {
  onMapClick: (latlng: L.LatLng) => void;
};

const countryBounds = L.latLngBounds([
  [39.65, 19.2667],
  [42.6667, 21.0667]
]);

const defaultIcon = new Icon({
  iconUrl: "/marker-icon.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

function MapEvents({onMapClick}: MapEventsProps) {
  useMapEvents({
    click(e) {
      if (countryBounds.contains(e.latlng)) {
        onMapClick(e.latlng);
      } else {
        toast("Cannot place marker out of bounds.");
      }
    }
  });
  return null;
}

export default function MapPicker({
  markerPosition,
  setMarkerPosition
}: MarkerPositionExtended) {
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
    <Card className="relative h-[50vh] lg:h-full pt-0 shadow-xl">
      <div
        className=" absolute w-full h-[50vh] md:h-full overflow-hidden"
        ref={containerRef}
      >
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

          <MapEvents onMapClick={(latlng) => setMarkerPosition(latlng)} />

          {markerPosition && (
            <Marker position={markerPosition} icon={defaultIcon}>
              <Popup>
                You placed a marker at:
                <br />
                Lat: {markerPosition.lat.toFixed(4)}, Lng:
                {markerPosition.lng.toFixed(4)}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

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
    </Card>
  );
}
