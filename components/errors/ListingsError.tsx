"use client";

import {useEffect} from "react";
import {toast} from "sonner";

// Rendered by the server component when the listings query fails; the toast
// can only fire in the browser, and the id keeps it from duplicating.
export default function ListingsError() {
  useEffect(() => {
    toast("An error occurred fetching listings. Please try again.");
  }, []);

  return null;
}
