import Link from "next/link";
import {Button} from "@/components/ui/button";

type PaginationProps = {
  page: number;
  totalPages: number;
  searchParams?: Record<string, string | null | undefined>;
};

const pageHref = (
  newPage: number,
  searchParams: PaginationProps["searchParams"]
) => {
  const params = new URLSearchParams();

  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  params.set("page", String(newPage));

  return `?${params.toString()}`;
};

export function Pagination({page, totalPages, searchParams}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-2 mt-10">
      {page <= 1 ? (
        <Button disabled>Previous</Button>
      ) : (
        <Button asChild>
          <Link href={pageHref(page - 1, searchParams)}>Previous</Link>
        </Button>
      )}
      <span>
        Page {page} of {totalPages}
      </span>
      {page >= totalPages ? (
        <Button disabled>Next</Button>
      ) : (
        <Button asChild>
          <Link href={pageHref(page + 1, searchParams)}>Next</Link>
        </Button>
      )}
    </div>
  );
}
