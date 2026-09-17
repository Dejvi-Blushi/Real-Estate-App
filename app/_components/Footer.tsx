"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="bg-black p-6 w-full text-white flex flex-col gap-6">
      <div className="w-full flex flex-col md:flex-row md:justify-between gap-8 max-w-270 mx-auto">
        <div className="flex flex-col gap-4">
          <Link href="/">
            <Image
              src="/logo_with_title.svg"
              alt="T&T Group logo"
              width={150}
              height={54}
              style={{width: "150px", height: "54px"}}
            />
          </Link>
          <p className="text-sm text-gray-400">
            Find your next home with T&T Group.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <span className="font-semibold">Listings</span>
          <Link href="/for-rent" className="text-sm text-gray-400">
            For Rent
          </Link>
          <Link href="/for-sale" className="text-sm text-gray-400">
            For Sale
          </Link>
          <Link href="/add-listing" className="text-sm text-gray-400">
            List Your Property
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          <span className="font-semibold">Company</span>
          <Link href="/" className="text-sm text-gray-400">
            Home
          </Link>
          <Link href="/contact" className="text-sm text-gray-400">
            Contact
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-gray-800 pt-4 text-sm text-gray-400 max-w-270 mx-auto w-full">
        <span>
          © {new Date().getFullYear()} T&T Group. All rights reserved.
        </span>
      </div>
    </div>
  );
}
