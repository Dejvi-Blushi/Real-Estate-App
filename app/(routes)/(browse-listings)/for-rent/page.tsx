import ListingsPage from "../_components/ListingsPage";

type Props = {
  searchParams: Promise<Filters>;
};

export default function ForRentPage({searchParams}: Props) {
  return <ListingsPage listingType="rent" searchParams={searchParams} />;
}
