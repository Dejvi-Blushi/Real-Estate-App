"use client";

import {Toaster} from "@/components/ui/sonner";
import {MapContainer, Marker, Popup} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L, {Icon} from "leaflet";

import MapTilerLayer from "./MapTilerLayer";

import ListingCard from "../cards/ListingCard";

import type {ListingsMarkers} from "@/types/types";
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

export default function MapListings({listings}: ListingsMarkers) {
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
    <Card className="relative h-[50vh] md:h-full pt-0 shadow-xl">
      <div
        className="absolute w-full h-[50vh] md:h-full overflow-hidden"
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

          {listings &&
            listings.map((listing) => {
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

      <Toaster />
    </Card>
  );
}
