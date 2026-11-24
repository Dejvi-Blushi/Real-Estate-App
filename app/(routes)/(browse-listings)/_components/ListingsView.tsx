import ListingCard from "@/components/cards/ListingCard";

import {Pagination} from "@/components/cards/Pagination";
import {maxListingsPerPage} from "@/lib/constants";
import {Card} from "@/components/ui/card";
import MapListingsClient from "../_components/MapListingsClient";
import {createSupabaseServerClient} from "@/lib/supabase/server";
import ListingsError from "@/components/errors/ListingsError";

type Props = Filters & {
  listingType: ListingType;
};

export default async function ListingsView({
  listingType,
  page: pageString,
  propertyType,
  city,
  bedrooms,
  bathrooms
}: Props) {
  const supabase = await createSupabaseServerClient();

  const page = Number(pageString);

  const from = (page - 1) * maxListingsPerPage;
  const to = from + maxListingsPerPage - 1;

  let listings: ListingFetchedData[] = [];
  let totalCount = 0;
  let fetchFailed = false;

  try {
    let query = supabase
      .from("listings")
      .select(
        `id, title, price, bedrooms, listing_type, property_type, bathrooms, latitude, longtitude, address, city, area_size, listing_images ( path )`,
        {count: "exact"}
      )
      .eq("listing_type", listingType)
      .eq("listing_images.position", 0)
      .order("created_at", {ascending: false})
      .range(from, to);

    if (propertyType) query = query.eq("property_type", propertyType);
    if (city) query = query.eq("city", city);
    if (bedrooms) query = query.gte("bedrooms", Number(bedrooms));
    if (bathrooms) query = query.gte("bathrooms", Number(bathrooms));

    const {data, count, error} = await query;

    if (error) {
      throw new Error("An error occurred fetching listings. Please try again.");
    }

    listings = (data ?? []).map((listing) => ({
      ...listing,
      listing_images: listing.listing_images.map((img) => ({
        ...img,
        path: supabase.storage.from("listing-images").getPublicUrl(img.path)
          .data.publicUrl
      }))
    }));

    totalCount = count ?? 0;
  } catch {
    fetchFailed = true;
  }

  const totalPages = Math.ceil(totalCount / maxListingsPerPage);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_55%] md:h-[calc(100dvh-4.5rem)] md:p-6 gap-4">
      {fetchFailed ? (
        <ListingsError />
      ) : listings.length === 0 ? (
        <p>No related listings have been found.</p>
      ) : (
        <div className="overflow-y-auto p-2 pb-10">
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
        <MapListingsClient listings={listings} />
      </div>
    </div>
  );
}
