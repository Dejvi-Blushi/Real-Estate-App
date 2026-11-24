import {Suspense} from "react";

import FilterBar from "@/components/filters/FilterBar";
import ListingsLoading from "./ListingsLoading";
import ListingsView from "./ListingsView";

type Props = {
  listingType: ListingType;
  searchParams: Promise<Filters>;
};

export default async function ListingsPage({listingType, searchParams}: Props) {
  const params = await searchParams;

  return (
    <>
      <FilterBar />

      <Suspense fallback={<ListingsLoading />}>
        <ListingsView
          listingType={listingType}
          page={params.page ?? "1"}
          propertyType={params.propertyType ?? null}
          city={params.city ?? null}
          bedrooms={params.bedrooms ?? null}
          bathrooms={params.bathrooms ?? null}
        />
      </Suspense>
    </>
  );
}
