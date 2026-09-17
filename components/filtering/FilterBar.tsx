import {useState} from "react";
import {Button} from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import {cities} from "@/lib/data/cities";
import type {Filters} from "@/types/types";
import {propertyTypes} from "@/lib/data/propertyTypes";
import {useSearchParams, useRouter, usePathname} from "next/navigation";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const defaultFilters = {
    propertyType: searchParams.get("propertyType") ?? "Any",
    city: searchParams.get("city") ?? "Any",
    bedrooms: searchParams.get("bedrooms") ?? "Any",
    bathrooms: searchParams.get("bathrooms") ?? "Any"
  };

  const [filters, setFilters] = useState<Filters>(defaultFilters);

  function updateFilter(key: keyof Filters, value: string) {
    setFilters((prev) => ({...prev, [key]: value}));
  }

  function handleSubmit() {
    const params = new URLSearchParams();

    if (filters.propertyType !== "Any")
      params.set("propertyType", filters.propertyType);

    if (filters.city !== "Any") params.set("city", filters.city);
    if (filters.bedrooms !== "Any") params.set("bedrooms", filters.bedrooms);
    if (filters.bathrooms !== "Any") params.set("bathrooms", filters.bathrooms);

    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    setFilters({
      propertyType: "Any",
      city: "Any",
      bedrooms: "Any",
      bathrooms: "Any"
    });

    router.push(`${pathname}`);
  }

  return (
    <div className="flex flex-wrap gap-2 p-3 justify-center items-center border-b-2 border-solid">
      <Select
        value={filters.city}
        onValueChange={(val) => updateFilter("city", val)}
      >
        <SelectTrigger className="w-32 h-10 text-xs">
          <SelectValue placeholder="City" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem key={"Any"} value={"Any"}>
              Any
            </SelectItem>
            {cities.map((city) => (
              <SelectItem key={city.value} value={city.value}>
                {city.value}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={filters.propertyType}
        onValueChange={(val) => updateFilter("propertyType", val)}
      >
        <SelectTrigger className="w-32 h-10 text-xs">
          <SelectValue placeholder="Property Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem key={"Any"} value={"Any"}>
              Any
            </SelectItem>
            {propertyTypes.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.value}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={filters.bedrooms?.toString()}
        onValueChange={(val) => updateFilter("bedrooms", val)}
      >
        <SelectTrigger className="w-32 h-10 text-xs">
          <SelectValue placeholder="Bedrooms" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key={"Any"} value={"Any"}>
            Any
          </SelectItem>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <SelectItem key={n} value={n.toString()}>
              {n}+ Bedrooms
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.bathrooms?.toString()}
        onValueChange={(val) => updateFilter("bathrooms", val)}
      >
        <SelectTrigger className="w-32 h-10 text-xs">
          <SelectValue placeholder="Bathrooms" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key={"Any"} value={"Any"}>
            Any
          </SelectItem>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <SelectItem key={n} value={n.toString()}>
              {n}+ Bathrooms
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="ml-4">
        <Button
          variant="outline"
          size="sm"
          className="h-10 text-xs text-neutral-500 mr-2"
          onClick={clearFilters}
        >
          Clear
        </Button>
        <Button size="sm" className="h-10 text-xs px-4" onClick={handleSubmit}>
          Search
        </Button>
      </div>
    </div>
  );
}
