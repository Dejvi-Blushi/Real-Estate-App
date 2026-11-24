"use client";

import {UserButton} from "@clerk/nextjs";
import {Building} from "lucide-react";

/**
 * Clerk inspects the `UserButton` children by component identity, so
 * `UserButton.MenuItems` / `UserButton.Link` must be rendered from a client
 * component. The signed-in/out decision itself lives in the server Header.
 */
export default function UserMenu() {
  return (
    <UserButton
      fallback={<div className="size-12 rounded-full" />}
      appearance={{
        elements: {
          userButtonAvatarBox:
            "w-12! h-12! [&_img]:animate-in [&_img]:fade-in [&_img]:duration-300"
        }
      }}
    >
      <UserButton.MenuItems>
        <UserButton.Link
          label="Manage listings"
          labelIcon={<Building size={16} />}
          href="/my-listings"
        />
      </UserButton.MenuItems>
    </UserButton>
  );
}
