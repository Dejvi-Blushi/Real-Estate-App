import Image from "next/image";
import {notFound} from "next/navigation";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

import {createSupabaseServerClient} from "@/lib/supabase/server";
import MapSingleClient from "./_components/MapSingleClient";

import {Bath, Bed, House, MapPinned, Phone, Scan} from "lucide-react";

type Props = {
  params: Promise<{id: string}>;
};

export default async function ViewListingPage({params}: Props) {
  const {id} = await params;
  const listingId = Number(id);

  const supabase = await createSupabaseServerClient();

  const {data, error} = await supabase
    .from("listings")
    .select(
      `id, title, price, description, listing_type, bedrooms, property_type, bathrooms, contact_info, latitude, longtitude, address, city, area_size, listing_images ( path, position )`
    )
    .eq("id", listingId)
    .single();

  if (error || !data) notFound();

  const listing = {
    ...data,
    listing_images: data.listing_images.map((img) => ({
      ...img,
      path: supabase.storage.from("listing-images").getPublicUrl(img.path).data
        .publicUrl
    }))
  };

  return (
    <div className="w-full max-w-340 mx-auto p-6 md:px-16 space-y-4">
      <div>
        <Carousel className="w-full overflow-hidden rounded-xl shadow-md">
          <CarouselContent>
            {listing.listing_images.map((image) => (
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
        <h1 className="text-3xl font-semibold">{listing.title}</h1>

        <p className="text-4xl font-bold">
          €{listing.price.toLocaleString()}
          <span className="text-2xl">
            {listing.listing_type === "rent" ? "/month" : ""}
          </span>
        </p>

        <p className="text-md">
          <MapPinned className="inline" /> {listing.address}, {listing.city}
        </p>

        <div className="flex gap-3 text-sm text-muted-foreground font-semibold flex-wrap">
          <span>
            <Bed size={18} className="inline" /> {listing.bedrooms}{" "}
            {listing.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
          </span>
          <span className="transform scale-250">·</span>
          <span>
            <Bath size={18} className="inline" /> {listing.bathrooms}{" "}
            {listing.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
          </span>
          <span className="transform scale-250">·</span>
          <span>
            <Scan size={18} className="inline" /> {listing.area_size}m²
          </span>
          <span className="transform scale-250">·</span>
          <span>
            <House size={18} className="inline" /> {listing.property_type}
          </span>
        </div>

        <span>
          <Phone className="inline" size={20} /> Contact Info:{" "}
          <a
            className="text-blue-500 hover:underline"
            href={`tel:${listing.contact_info}`}
          >
            {listing.contact_info}
          </a>
        </span>
      </div>

      <div>
        <h2 className="text-xl font-semibold pb-2">Description</h2>
        <p className="text-md text-muted-foreground whitespace-pre-line">
          {listing.description}
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold pb-2">Location</h2>
        <MapSingleClient
          markerPosition={{
            lat: listing.latitude,
            lng: listing.longtitude
          }}
        />
      </div>
    </div>
  );
}
