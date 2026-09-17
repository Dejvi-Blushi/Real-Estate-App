"use client";

import Image from "next/image";
import type {ListingFetchedData} from "@/types/types";
import {MapPinned, Scan, Bath, Bed, House} from "lucide-react";
import Link from "next/link";

export default function ListingCard({listing}: {listing: ListingFetchedData}) {
  const thumbnail = listing.listing_images?.[0]?.path ?? null;

  return (
    <Link
      href={`/view-listing/${listing.id}`}
      className="in-[.leaflet-container]:text-inherit!"
    >
      <div className="relative aspect-video">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={listing.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 animate-pulse bg-linear-to-r from-neutral-300 via-neutral-400 to-neutral-300 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700" />
        )}
      </div>

      <div className="p-3">
        <p className="font-semibold text-xl truncate my-0!">{listing.title}</p>
        <p className="text-sm text-muted-foreground truncate my-0!">
          <MapPinned size={22} className="inline" /> {listing.address},{" "}
          {listing.city.charAt(0).toUpperCase() + listing.city.slice(1)}
        </p>
        <div className="flex gap-2 text-xs text-muted-foreground font-semibold pt-2">
          <span>
            <Bed size={16} className="inline" /> {listing.bedrooms}
          </span>
          <span className="transform scale-250 ">·</span>
          <span>
            <Bath size={16} className="inline" /> {listing.bathrooms}
          </span>
          <span className="transform scale-250 ">·</span>
          <span>
            <Scan size={16} className="inline" /> {listing.area_size}m²
          </span>{" "}
          <span className="transform scale-250 ">·</span>
          <span>
            <House size={16} className="inline" /> {listing.property_type}
          </span>
        </div>
        <p className="text-lg font-bold pt-1 my-0!">
          €{listing.price.toLocaleString()}
          <span className="text-base font-semibold">
            {listing.listing_type === "rent" ? "/month" : ""}
          </span>
        </p>
      </div>
    </Link>
  );
}
