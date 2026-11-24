import Link from "next/link";

import {Button, buttonVariants} from "@/components/ui/button";
import {cities} from "@/lib/constants";
import {propertyTypes} from "@/lib/constants";
import {cn} from "@/lib/utils";

type FilterBarProps = {
  searchParams?: Partial<Filters>;
};

const selectClassName =
  "h-10 w-32 rounded-md border border-input bg-transparent px-2.5 text-xs shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export default function FilterBar({searchParams}: FilterBarProps) {
  return (
    <form
      method="get"
      className="flex flex-wrap gap-2 p-3 justify-center items-center border-b-2 border-solid"
    >
      <select
        name="city"
        defaultValue={searchParams?.city ?? ""}
        className={selectClassName}
      >
        <option value="">Any</option>
        {cities.map((city) => (
          <option key={city.value} value={city.value}>
            {city.value}
          </option>
        ))}
      </select>

      <select
        name="propertyType"
        defaultValue={searchParams?.propertyType ?? ""}
        className={selectClassName}
      >
        <option value="">Any</option>
        {propertyTypes.map((item) => (
          <option key={item.value} value={item.value}>
            {item.value}
          </option>
        ))}
      </select>

      <select
        name="bedrooms"
        defaultValue={searchParams?.bedrooms ?? ""}
        className={selectClassName}
      >
        <option value="">Any</option>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <option key={n} value={n.toString()}>
            {n}+ Bedrooms
          </option>
        ))}
      </select>

      <select
        name="bathrooms"
        defaultValue={searchParams?.bathrooms ?? ""}
        className={selectClassName}
      >
        <option value="">Any</option>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <option key={n} value={n.toString()}>
            {n}+ Bathrooms
          </option>
        ))}
      </select>

      <div className="ml-4">
        <Link
          href="?"
          className={cn(
            buttonVariants({variant: "outline", size: "sm"}),
            "h-10 text-xs text-neutral-500 mr-2"
          )}
        >
          Clear
        </Link>
        <Button type="submit" size="sm" className="h-10 text-xs px-4">
          Search
        </Button>
      </div>
    </form>
  );
}
