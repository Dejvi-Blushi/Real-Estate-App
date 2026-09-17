"use client";

import FormComponent from "@/components/forms/FormComponent";

import {useState} from "react";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/maps/MapPicker"), {
  ssr: false,
  loading: () => <div className="h-[50vh] w-full bg-slate-100 animate-pulse" />
});

export default function AddListing() {
  const [markerPosition, setMarkerPosition] = useState<L.LatLng | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
      <div className="flex flex-col justify-center px-4 lg:pt-2 lg:pb-6 lg:pl-4 lg:pr-6">
        <h2 className="font-bold text-lg text-center mt-2 lg:mt-0 mb-2">
          Select a location in the map
        </h2>

        <MapPicker
          markerPosition={markerPosition}
          setMarkerPosition={setMarkerPosition}
        />
      </div>

      <div className="w-full flex flex-col justify-center px-4 pb-4 lg:pt-2 lg:pb-6 lg:pl-8 lg:pr-12">
        <h2 className="font-bold text-lg text-center mt-4 lg:mt-0 mb-2">
          Enter your listing information
        </h2>

        <div className="w-full self-end">
          <FormComponent markerPosition={markerPosition} />
        </div>
      </div>
    </div>
  );
}
