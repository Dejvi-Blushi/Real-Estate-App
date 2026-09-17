"use client";

import Image from "next/image";
import Link from "next/link";
import type {ListingFetchedData} from "@/types/types";
import {Button} from "../ui/button";
import {MapPinned, Scan, Bath, Bed, House, Pencil, Trash2} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

type MyListingCardProps = {
  listing: ListingFetchedData;
  handleDelete: (id: number) => void;
};

export default function MyListingCard({
  listing,
  handleDelete
}: MyListingCardProps) {
  const thumbnail = listing.listing_images?.[0]?.path ?? null;

  return (
    <div className="relative flex flex-row overflow-hidden p-0">
      <Link href={`/view-listing/${listing.id}`} className="absolute inset-0">
        <span className="sr-only">View {listing.title}</span>
      </Link>
      <div className="relative max-w-48 min-w-34 shrink-0 aspect-video pointer-events-none">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={listing.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="bg-gray-300 absolute inset-0 flex justify-center items-center">
            <p>Image not found</p>
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row flex-1 sm:items-center justify-between p-3 gap-3 min-w-0 min-h-40">
        <div className="pointer-events-none space-y-1 min-w-0">
          <p className="font-semibold text-xl truncate">{listing.title}</p>
          <p className="text-sm text-muted-foreground truncate">
            <MapPinned size={22} className="inline" /> {listing.address},{" "}
            {listing.city.charAt(0).toUpperCase() + listing.city.slice(1)}
          </p>
          <div className="flex gap-2 text-xs text-muted-foreground font-semibold pt-2 flex-wrap">
            <span>
              <Bed size={16} className="inline" /> {listing.bedrooms}
            </span>
            <span className="transform scale-250">·</span>
            <span>
              <Bath size={16} className="inline" /> {listing.bathrooms}
            </span>
            <span className="transform scale-250">·</span>
            <span>
              <Scan size={16} className="inline" /> {listing.area_size}m²
            </span>{" "}
            <span className="transform scale-250">·</span>
            <span>
              <House size={16} className="inline" /> {listing.property_type}
            </span>
          </div>
          <p className="text-lg font-bold pt-1">
            €{listing.price.toLocaleString()}
            <span className="text-base font-semibold">
              {listing.listing_type === "rent" ? "/month" : ""}
            </span>
          </p>
        </div>

        <div className="z-10 flex flex-col gap-2 shrink-0">
          <Link href={`/edit-listing/${listing.id}`}>
            <Button variant="outline" size="sm" className="w-full">
              <Pencil size={14} />
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="w-full">
                <Trash2 size={14} />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this listing?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this listing from your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(listing.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
