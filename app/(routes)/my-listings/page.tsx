"use client";

import {useState, useEffect} from "react";
import {useUser} from "@clerk/nextjs";
import {useSupabaseClient} from "@/lib/supabase/client";
import UserListing from "@/components/cards/UserListing";
import {toast} from "sonner";
import type {ListingFetchedData} from "@/types/types";
import {Card} from "@/components/ui/card";
import {useSearchParams} from "next/navigation";
import {maxListingsPerPage} from "@/lib/data/maxListingsPerPage";
import {Pagination} from "@/components/cards/Pagination";

export default function MyListingsPage() {
  const {user, isLoaded} = useUser();
  const supabase = useSupabaseClient();

  const [listings, setListings] = useState<ListingFetchedData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [totalCount, setTotalCount] = useState<number>(0);

  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const totalPages = Math.ceil(totalCount / maxListingsPerPage);

  async function fetchMyListings() {
    const from = (page - 1) * maxListingsPerPage;
    const to = from + maxListingsPerPage - 1;

    try {
      const {data, count, error} = await supabase
        .from("listings")
        .select(
          `id, title, price, bedrooms, property_type, listing_type, bathrooms, latitude, longtitude, address, city, area_size, listing_images ( path )`,
          {count: "exact"}
        )
        .eq("user_id", user?.id)
        .eq("listing_images.position", 0)
        .order("created_at", {ascending: false})
        .range(from, to);

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
      toast("An error occurred fetching your listings. Please try again.");
    }
  }

  useEffect(() => {
    if (isLoaded) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchMyListings();
    }
  }, [isLoaded, searchParams]);

  async function handleDelete(id: number) {
    try {
      const {data: files, error: listError} = await supabase.storage
        .from("listing-images")
        .list(String(id));

      if (listError) {
        toast(
          "An error occurred deleting the listing's images. Please try again."
        );
      }

      if (files && files.length > 0) {
        const filePaths = files.map((file) => `${id}/${file.name}`);

        const {error: filesError} = await supabase.storage
          .from("listing-images")
          .remove(filePaths);

        if (filesError) {
          toast(
            "An error occurred deleting the listing's images. Please try again."
          );
        }
      }

      const {error: imagesError} = await supabase
        .from("listing_images")
        .delete()
        .eq("listing_id", id);

      if (imagesError) {
        toast(
          "An error occurred deleting the listing's images. Please try again."
        );
      }

      const {error} = await supabase.from("listings").delete().eq("id", id);

      if (error) {
        throw new Error(
          "An error occurred deleting the listing. Please try again."
        );
      }

      toast("Listing deleted successfully.");

      await fetchMyListings();
    } catch {
      toast("An error occurred deleting the listing. Please try again.");
    }
  }

  return (
    <div className="pt-4 pb-8 px-6 md:px-13">
      <h1 className="text-2xl font-bold mb-4">My Listings</h1>

      {isLoading ? (
        <p>Loading listings...</p>
      ) : listings.length === 0 ? (
        <p>No listings have been found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {listings.map((listing) => (
            <Card key={listing.id} className="w-full py-0 shadow-xl">
              <UserListing listing={listing} handleDelete={handleDelete} />
            </Card>
          ))}

          <Pagination page={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
