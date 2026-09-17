"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

export default function NavLinks() {
  const path = usePathname();

  return (
    <ul className="flex flex-col lg:flex-row gap-4 lg:gap-10 text-white ">
      <Link href="/">
        <li
          className={`hover:text-secondary transition-colors duration-100 ease-in-out cursor-pointer font-medium text-xl lg:text-base ${path === "/" && "text-secondary"}`}
        >
          Home
        </li>
      </Link>
      <Link href="/for-sale">
        <li
          className={`hover:text-secondary transition-colors duration-100 ease-in-out cursor-pointer font-medium text-xl lg:text-base ${path === "/for-sale" && "text-secondary"}`}
        >
          For Sale
        </li>
      </Link>
      <Link href="/for-rent">
        <li
          className={`hover:text-secondary transition-colors duration-100 ease-in-out cursor-pointer font-medium text-xl lg:text-base ${path === "/for-rent" && "text-secondary"}`}
        >
          For Rent
        </li>
      </Link>

      <Link href="/contact">
        <li
          className={`hover:text-secondary transition-colors duration-100 ease-in-out cursor-pointer font-medium text-xl lg:text-base ${path === "/contact" && "text-secondary"}`}
        >
          Contact
        </li>
      </Link>
    </ul>
  );
}
