"use client";

import Image from "next/image";

import {useState, useEffect} from "react";

import dynamic from "next/dynamic";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

import {useSupabaseClient} from "@/lib/supabase/client";

import {useParams} from "next/navigation";
import {toast} from "sonner";
import {ListingFetchedData} from "@/types/types";
import {Bath, Bed, House, MapPinned, Phone, Scan} from "lucide-react";

const SingleListingMarker = dynamic(
  () => import("@/components/maps/SingleListingMarker"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[50vh] w-full bg-slate-100 animate-pulse" />
    )
  }
);

export default function ViewListing() {
  const supabase = useSupabaseClient();

  const {id} = useParams<{id: string}>();
  const listingId = Number(id);

  const [listingData, setListingData] = useState<ListingFetchedData | null>(
    null
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [markerPosition, setMarkerPosition] = useState<L.LatLng | null>(null);

  useEffect(() => {
    async function fetchListing() {
      const L = (await import("leaflet")).default;

      try {
        const {data, error} = await supabase
          .from("listings")
          .select(
            `id, title, price, description, listing_type, bedrooms, property_type, bathrooms, contact_info, latitude, longtitude, address, city, area_size, listing_images ( path, position )`
          )
          .eq("id", listingId)
          .single();

        if (error) {
          throw new Error("Couldn't retreive listing. Please try again.");
        }

        const listingsWithUrls = {
          ...data,
          listing_images: data.listing_images.map((img) => ({
            ...img,
            path: supabase.storage.from("listing-images").getPublicUrl(img.path)
              .data.publicUrl
          }))
        };

        setListingData(listingsWithUrls);

        setMarkerPosition(new L.LatLng(data.latitude, data.longtitude));

        setIsLoading(false);
      } catch {
        toast("Couldn't retreive listing. Please try again.");
        setIsLoading(false);
      }
    }

    fetchListing();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading listing...</p>
      </div>
    );
  }

  if (listingData === null && !isLoading) {
    return;
  }

  return (
    <div className="w-full max-w-340 mx-auto p-6 md:px-16 space-y-4">
      <div>
        <Carousel className="w-full overflow-hidden rounded-xl shadow-md">
          <CarouselContent>
            {listingData?.listing_images.map((image) => (
              <CarouselItem key={image.position}>
                <div className="relative aspect-video w-full max-h-150 min-h-90 h-full">
                  <Image
                    src={image.path}
                    alt="Listing image"
                    fill
                    priority={image.position === 0}
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="flex left-4" />
          <CarouselNext className="flex right-4" />
        </Carousel>
      </div>
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">{listingData?.title}</h1>

        <p className="text-4xl font-bold">
          €{listingData?.price.toLocaleString()}
          <span className="text-2xl">
            {listingData?.listing_type === "rent" ? "/month" : ""}
          </span>
        </p>

        <p className="text-md">
          <MapPinned className="inline" /> {listingData?.address},{" "}
          {listingData?.city}
        </p>

        <div className="flex gap-3 text-sm text-muted-foreground font-semibold flex-wrap">
          <span>
            <Bed size={18} className="inline" /> {listingData?.bedrooms}{" "}
            {listingData?.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
          </span>
          <span className="transform scale-250">·</span>
          <span>
            <Bath size={18} className="inline" /> {listingData?.bathrooms}{" "}
            {listingData?.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
          </span>
          <span className="transform scale-250">·</span>
          <span>
            <Scan size={18} className="inline" /> {listingData?.area_size}m²
          </span>
          <span className="transform scale-250">·</span>
          <span>
            <House size={18} className="inline" /> {listingData?.property_type}
          </span>
        </div>

        <span>
          <Phone className="inline" size={20} /> Contact Info:{" "}
          <a
            className="text-blue-500 hover:underline text-secondary"
            href={`tel:${listingData?.contact_info}`}
          >
            {listingData?.contact_info}
          </a>
        </span>
      </div>

      <div>
        <h2 className="text-xl font-semibold pb-2">Description</h2>
        <p className="text-md text-muted-foreground whitespace-pre-line">
          {listingData?.description}
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold pb-2">Location</h2>
        <SingleListingMarker markerPosition={markerPosition} />
      </div>
    </div>
  );
}
