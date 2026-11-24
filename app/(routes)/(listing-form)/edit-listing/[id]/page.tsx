import {auth} from "@clerk/nextjs/server";
import {notFound, redirect} from "next/navigation";

import {createSupabaseServerClient} from "@/lib/supabase/server";
import ListingFormShell from "../../_components/ListingFormShell";

type Props = {
  params: Promise<{id: string}>;
};

export default async function EditListingPage({params}: Props) {
  const {id} = await params;
  const listingId = Number(id);

  const supabase = await createSupabaseServerClient();

  const {data, error} = await supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .maybeSingle();

  if (error || !data) notFound();

  const {userId} = await auth();

  if (!userId || userId !== data.user_id) redirect("/");

  return (
    <ListingFormShell
      listingId={data.id}
      defaultData={data}
      initialPosition={{lat: data.latitude, lng: data.longtitude}}
    />
  );
}
