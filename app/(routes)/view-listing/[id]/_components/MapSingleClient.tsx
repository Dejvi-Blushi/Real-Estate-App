"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/maps/Map"), {
  ssr: false,
  loading: () => <div className="h-140 w-full bg-slate-100 animate-pulse" />
});

export default function MapSingleClient({
  markerPosition
}: {
  markerPosition: Coordinates;
}) {
  return <Map mode="single" markerPosition={markerPosition} />;
}
