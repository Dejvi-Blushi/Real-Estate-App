import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";

import {createSupabaseServerClient} from "@/lib/supabase/server";
import {maxListingsPerPage} from "@/lib/constants";

import MyListings from "./MyListings";

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function MyListingsPage({searchParams}: Props) {
  const {userId} = await auth();

  if (!userId) redirect("/");

  const params = await searchParams;
  const requestedPage = Number(params.page ?? "1");
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const supabase = await createSupabaseServerClient();

  const from = (page - 1) * maxListingsPerPage;
  const to = from + maxListingsPerPage - 1;

  let listings: ListingFetchedData[] = [];
  let totalCount = 0;
  let fetchFailed = false;

  try {
    const {data, count, error} = await supabase
      .from("listings")
      .select(
        `id, title, price, bedrooms, property_type, listing_type, bathrooms, latitude, longtitude, address, city, area_size, listing_images ( path )`,
        {count: "exact"}
      )
      .eq("user_id", userId)
      .eq("listing_images.position", 0)
      .order("created_at", {ascending: false})
      .range(from, to);

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

  return (
    <MyListings
      listings={listings}
      totalCount={totalCount}
      page={page}
      fetchFailed={fetchFailed}
    />
  );
}
