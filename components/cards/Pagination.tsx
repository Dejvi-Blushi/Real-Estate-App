"use client";

import {useRouter, usePathname, useSearchParams} from "next/navigation";
import {Button} from "@/components/ui/button";

type PaginationProps = {
  page: number;
  totalPages: number;
};

export function Pagination({page, totalPages}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goToPage(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-2 mt-10">
      <Button disabled={page <= 1} onClick={() => goToPage(page - 1)}>
        Previous
      </Button>
      <span>
        Page {page} of {totalPages}
      </span>
      <Button disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>
        Next
      </Button>
    </div>
  );
}
