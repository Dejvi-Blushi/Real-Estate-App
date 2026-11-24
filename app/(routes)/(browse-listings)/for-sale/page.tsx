import ListingsPage from "../_components/ListingsPage";

type Props = {
  searchParams: Promise<Filters>;
};

export default function ForSalePage({searchParams}: Props) {
  return <ListingsPage listingType="sell" searchParams={searchParams} />;
}
