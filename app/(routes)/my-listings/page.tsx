import MyListings from "./MyListings";

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function MyListingsPage({searchParams}: Props) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");

  return <MyListings page={page} />;
}
