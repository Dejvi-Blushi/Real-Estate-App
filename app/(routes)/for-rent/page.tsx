"use client";

import {useState, useEffect} from "react";
import {useSupabaseClient} from "@/lib/supabase/client";
import ListingCard from "@/components/cards/ListingCard";
import {toast} from "sonner";
import type {ListingFetchedData} from "@/types/types";

import dynamic from "next/dynamic";

import FilterBar from "@/components/filtering/FilterBar";
import {useSearchParams} from "next/navigation";
import {Pagination} from "@/components/cards/Pagination";
import {maxListingsPerPage} from "@/lib/data/maxListingsPerPage";
import {Card} from "@/components/ui/card";

const MapListings = dynamic(() => import("@/components/maps/MapListings"), {
  ssr: false,
  loading: () => <div className="h-[50vh] w-full bg-slate-100 animate-pulse" />
});

export default function ForRentPage() {
  const [listings, setListings] = useState<ListingFetchedData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [totalCount, setTotalCount] = useState<number>(0);

  const searchParams = useSearchParams();

  const supabase = useSupabaseClient();

  const page = Number(searchParams.get("page") ?? "1");
  const totalPages = Math.ceil(totalCount / maxListingsPerPage);

  useEffect(() => {
    async function fetchListings() {
      const from = (page - 1) * maxListingsPerPage;
      const to = from + maxListingsPerPage - 1;

      try {
        let query = supabase
          .from("listings")
          .select(
            `id, title, price, bedrooms, listing_type, property_type, bathrooms, latitude, longtitude, address, city, area_size, listing_images ( path )`,
            {count: "exact"}
          )
          .eq("listing_type", "rent")
          .eq("listing_images.position", 0)
          .order("created_at", {ascending: false})
          .range(from, to);

        const propertyType = searchParams.get("propertyType");
        const city = searchParams.get("city");
        const bedrooms = searchParams.get("bedrooms");
        const bathrooms = searchParams.get("bathrooms");

        if (propertyType) query = query.eq("property_type", propertyType);
        if (city) query = query.eq("city", city);
        if (bedrooms) query = query.gte("bedrooms", Number(bedrooms));
        if (bathrooms) query = query.gte("bathrooms", Number(bathrooms));

        const {data, count, error} = await query;

        if (error) {
          setIsLoading(false);

          throw new Error(
            "An error occurred fetching listings. Please try again."
          );
        }

        const listingsWithUrls = data.map((listing) => ({
          ...listing,
          listing_images: listing.listing_images.map((img) => ({
            ...img,
            path: supabase.storage.from("listing-images").getPublicUrl(img.path)
              .data.publicUrl
          }))
        }));

        setListings(listingsWithUrls);
        setTotalCount(count ?? 0);

        setIsLoading(false);
      } catch {
        toast("An error occurred fetching listings. Please try again.");
      }
    }

    fetchListings();
  }, [searchParams]);

  return (
    <>
      <FilterBar />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_55%] md:h-[calc(100dvh-4.5rem)] md:p-6 gap-4">
        {isLoading ? (
          <p>Loading listings...</p>
        ) : listings.length === 0 ? (
          <p>No related listings have been found.</p>
        ) : (
          <div className="overflow-y-auto p-2 ">
            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
              {listings.map((listing) => (
                <Card key={listing.id} className="w-full pt-0 pb-1 shadow-xl">
                  <ListingCard listing={listing} />
                </Card>
              ))}
            </div>

            <Pagination page={page} totalPages={totalPages} />
          </div>
        )}

        <div className="h-[50vh] md:h-full hidden md:inline p-2">
          <MapListings listings={listings} />
        </div>
      </div>
    </>
  );
}
