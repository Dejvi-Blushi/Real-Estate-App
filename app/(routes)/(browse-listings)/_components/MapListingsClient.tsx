"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/maps/Map"), {
  ssr: false,
  loading: () => <div className="h-[50vh] w-full bg-slate-100 animate-pulse" />
});

export default function MapListingsClient({listings}: ListingsMarkers) {
  return <Map mode="listings" listings={listings} />;
}
