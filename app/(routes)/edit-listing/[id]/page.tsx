"use client";

import FormComponent from "@/components/forms/FormComponent";

import {useState, useEffect} from "react";
import dynamic from "next/dynamic";

import {useSupabaseClient} from "@/lib/supabase/client";

import {useParams, useRouter} from "next/navigation";
import {toast} from "sonner";
import {FormData} from "@/types/types";
import {useUser} from "@clerk/nextjs";

const MapPicker = dynamic(() => import("@/components/maps/MapPicker"), {
  ssr: false,
  loading: () => <div className="h-[50vh] w-full bg-slate-100 animate-pulse" />
});

export default function EditListing() {
  const supabase = useSupabaseClient();

  const router = useRouter();

  const {user, isLoaded} = useUser();

  const {id} = useParams<{id: string}>();
  const listingId = Number(id);

  const [defaultData, setDefaultData] = useState<FormData | null>(null);

  const [markerPosition, setMarkerPosition] = useState<L.LatLng | null>(null);

  useEffect(() => {
    if (isLoaded) {
      async function fetchListing() {
        const L = (await import("leaflet")).default;

        try {
          const {data, error} = await supabase
            .from("listings")
            .select("*")
            .eq("id", listingId)
            .single();

          if (error) {
            throw new Error(
              "Couldn't retreive listing data. Please try again."
            );
          }

          if (user?.id !== data?.user_id) {
            router.push("/");
            return;
          }

          setDefaultData(data);

          setMarkerPosition(new L.LatLng(data.latitude, data.longtitude));
        } catch {
          toast("Couldn't retreive listing data. Please try again.");
        }
      }

      fetchListing();
    }
  }, [isLoaded]);

  if (String(user?.id) === defaultData?.user_id) {
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
}
