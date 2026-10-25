import ForSale from "./ForSale";

type Props = {
  searchParams: Promise<{
    page?: string;
    propertyType?: string;
    city?: string;
    bedrooms?: string;
    bathrooms?: string;
  }>;
};

export default async function ForSalePage({searchParams}: Props) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");

  const propertyType = params.propertyType ?? null;
  const city = params.city ?? null;
  const bedrooms = params.bedrooms ?? null;
  const bathrooms = params.bathrooms ?? null;

  return (
    <ForSale
      page={page}
      propertyType={propertyType}
      city={city}
      bedrooms={bedrooms}
      bathrooms={bathrooms}
    />
  );
}
