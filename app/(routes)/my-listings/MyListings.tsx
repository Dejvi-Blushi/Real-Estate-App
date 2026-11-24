"use client";

import {useRouter} from "next/navigation";
import {toast} from "sonner";

import ListingsError from "@/components/errors/ListingsError";
import UserListing from "@/components/cards/UserListing";
import {Pagination} from "@/components/cards/Pagination";
import {Card} from "@/components/ui/card";
import {maxListingsPerPage} from "@/lib/constants";
import {useSupabaseClient} from "@/lib/supabase/client";

type Props = {
  listings: ListingFetchedData[];
  totalCount: number;
  page: number;
  fetchFailed?: boolean;
};

export default function MyListings({
  listings,
  totalCount,
  page,
  fetchFailed = false
}: Props) {
  const router = useRouter();
  const supabase = useSupabaseClient();

  const totalPages = Math.ceil(totalCount / maxListingsPerPage);

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

      router.refresh();
    } catch {
      toast("An error occurred deleting the listing. Please try again.");
    }
  }

  return (
    <div className="pt-4 pb-8 px-6 md:px-13">
      <h1 className="text-2xl font-bold mb-4">My Listings</h1>

      {fetchFailed ? (
        <ListingsError />
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
