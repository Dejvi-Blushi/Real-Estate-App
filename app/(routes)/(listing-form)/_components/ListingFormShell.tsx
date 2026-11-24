"use client";

import {useState} from "react";
import MapPickerClient from "./MapPickerClient";
import FormComponent from "@/components/forms/FormComponent";

type Props = {
  defaultData?: ListingFormData;
  listingId?: number;
  initialPosition?: Coordinates;
};

export default function ListingFormShell({
  defaultData,
  listingId,
  initialPosition
}: Props) {
  const [markerPosition, setMarkerPosition] = useState<Coordinates | null>(
    initialPosition ?? null
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
      <div className="flex flex-col justify-center px-4 lg:pt-2 lg:pb-6 lg:pl-4 lg:pr-6">
        <h2 className="font-bold text-lg text-center mt-2 lg:mt-0 mb-2">
          Select a location in the map
        </h2>

        <MapPickerClient
          markerPosition={markerPosition}
          setMarkerPosition={setMarkerPosition}
        />
      </div>

      <div className="w-full flex flex-col justify-center px-4 pb-4 lg:pt-2 lg:pb-6 lg:pl-8 lg:pr-12">
        <h2 className="font-bold text-lg text-center mt-4 lg:mt-0 mb-2">
          Enter your listing information
        </h2>

        <div className="w-full self-end">
          <FormComponent
            markerPosition={markerPosition}
            defaultData={defaultData}
            listingId={listingId}
          />
        </div>
      </div>
    </div>
  );
}
