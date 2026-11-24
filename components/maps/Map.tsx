"use client";

import {toast} from "sonner";
import {Toaster} from "@/components/ui/sonner";
import {MapContainer, Marker, Popup, useMapEvents} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L, {Icon} from "leaflet";

import MapTilerLayer from "./MapTilerLayer";

import ListingCard from "../cards/ListingCard";

import {useEffect, useRef} from "react";
import {cn} from "@/lib/utils";
import {Card} from "../ui/card";

type Props = MarkerState & {
  /** picker: place a marker, single: show one fixed marker, listings: show all. */
  mode: "picker" | "single" | "listings";
  listings?: ListingFetchedData[];
  className?: string;
};

type MapEventsProps = {
  onMapClick: (latlng: Coordinates) => void;
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

export default function Map({
  mode,
  listings,
  markerPosition,
  setMarkerPosition
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const isPicker = mode === "picker";
  const isSingle = mode === "single";

  // Single mode reuses the picker's marker + popup, but never listens for clicks.
  const marker =
    (isPicker || isSingle) &&
    markerPosition?.lat != null &&
    markerPosition.lng != null
      ? markerPosition
      : null;

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
    <Card
      className={cn(
        "relative h-[50vh] pt-0 shadow-xl",
        isPicker ? "lg:h-full" : isSingle ? "h-140" : "md:h-full"
      )}
    >
      <div
        className={cn(
          "absolute w-full overflow-hidden",
          isSingle ? "h-full" : "h-[50vh] md:h-full"
        )}
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

          {isPicker && setMarkerPosition && (
            <MapEvents onMapClick={(latlng) => setMarkerPosition(latlng)} />
          )}

          {marker && (
            <Marker position={[marker.lat, marker.lng]} icon={defaultIcon}>
              <Popup>
                You placed a marker at:
                <br />
                Lat: {marker.lat.toFixed(4)}, Lng: {marker.lng.toFixed(4)}
              </Popup>
            </Marker>
          )}

          {mode === "listings" &&
            listings?.map((listing) => {
              if (listing.latitude == null || listing.longtitude == null)
                return null;

              return (
                <Marker
                  key={listing.id}
                  position={[listing.latitude, listing.longtitude]}
                  icon={defaultIcon}
                >
                  <Popup
                    maxHeight={420}
                    maxWidth={300}
                    closeButton={false}
                    className="[&_.leaflet-popup-content]:m-0! [&_.leaflet-popup-content]:text-black! 
                                 [&_.leaflet-popup-content_img]:rounded-t-xl! 
                                 [&_.leaflet-popup-content-wrapper]:p-0! 
                                 [&_.leaflet-popup-content-wrapper]:rounded-xl! 
                                 [&_.leaflet-popup-content-wrapper]:overflow-hidden"
                  >
                    <ListingCard listing={listing} />
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>

      {marker && (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`http://maps.google.com/?q=${marker.lat},${marker.lng}`}
          className="absolute bottom-8 left-8 z-400 -mt-12 max-w-56"
        >
          <div className="text-xl bg-white p-1.5 rounded-sm border shadow-sm font-medium text-center text-slate-800">
            Open in Google Maps
          </div>
        </a>
      )}

      {mode === "listings" && <Toaster />}
    </Card>
  );
}
