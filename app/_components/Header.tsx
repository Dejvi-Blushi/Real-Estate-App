"use client";

import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import Image from "next/image";
import NavLinks from "./NavLinks";
import Link from "next/link";
import {UserButton, useUser} from "@clerk/nextjs";

import {Menu, Plus, Building, X} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";

export default function Header() {
  const {isSignedIn} = useUser();

  return (
    <nav className="flex justify-between items-center bg-black p-2 gap-2 fixed top-0 w-full z-500 h-18">
      <div className="flex gap-10 items-center">
        <Link href="/">
          <Image
            src="/logo_with_title.svg"
            alt="T&T Group logo"
            width={150}
            height={54}
            style={{width: "150px", height: "54px"}}
            priority
          />
        </Link>

        <div className="hidden lg:flex">
          <NavLinks />
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <div className="hidden lg:block">
          <Link href="/add-listing">
            <Button>
              <Plus />
              List Your Property
            </Button>
          </Link>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="lg:hidden text-white bg-black hover:bg-black"
            >
              <Menu className="w-6! h-6!" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            showCloseButton={false}
            className="bg-black text-white border-neutral-800 lg:hidden mt-18 h-[calc(100dvh-4.5rem)]! gap-0 max-w-90"
          >
            <SheetClose asChild>
              <Button className="absolute top-4 right-4 p-2 text-white bg-black hover:bg-black">
                <X className="w-8! h-8!" />
              </Button>
            </SheetClose>

            <SheetHeader>
              <SheetTitle className="text-white text-4xl">Menu</SheetTitle>
            </SheetHeader>

            <Separator className="bg-secondary max-w-[95%] mx-auto" />

            <div className="flex flex-col gap-4 p-4 h-full justify-between">
              <NavLinks />

              <Link href="/add-listing">
                <Button className="flex gap-2 w-full">
                  <Plus />
                  List Your Property
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        {isSignedIn ? (
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-12! h-12!"
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
        ) : (
          <Link href="/sign-in">
            <Button variant="outline" className="text-black">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
