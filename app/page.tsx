import Link from "next/link";
import Image from "next/image";
import {
  Key,
  Home as HomeIcon,
  ShieldCheck,
  Users,
  Search,
  Mail,
  ArrowRight
} from "lucide-react";
import {Button} from "@/components/ui/button";
export default function HomePage() {
  return (
    <div className="flex flex-col bg-background">
      <section className="relative min-h-[85vh] flex items-center justify-center px-6 overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="A modern home exterior"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 w-full max-w-3xl text-center text-white">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/70 mb-5">
            Find your place in Albania
          </p>
          <h1 className="font-heading text-4xl md:text-6xl font-medium leading-[1.08] tracking-tight">
            Find the right place, <br className="hidden sm:block" /> not just
            any place.
          </h1>
          <p className="text-base md:text-lg text-white/75 mt-6 max-w-xl mx-auto leading-relaxed">
            Browse apartments, houses, and land across Albania, whether
            you&apos;re looking to rent or ready to buy.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 max-w-xl mx-auto">
            <Link
              href="/for-rent"
              className="group flex items-center justify-between gap-4 rounded-2xl border border-white/25 bg-white/10 p-5 text-left backdrop-blur-md transition-all duration-200 hover:bg-white/15 hover:border-white/50"
            >
              <div>
                <p className="text-sm text-white/60">Looking to move in</p>
                <p className="text-xl font-semibold mt-1">For Rent</p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Key
                  size={21}
                  className="text-white/70 transition-transform duration-200 group-hover:scale-110 group-hover:text-white"
                />
              </div>
            </Link>
            <Link
              href="/for-sale"
              className="group flex items-center justify-between gap-4 rounded-2xl border border-white/25 bg-white/10 p-5 text-left backdrop-blur-md transition-all duration-200 hover:bg-white/15 hover:border-white/50"
            >
              <div>
                <p className="text-sm text-white/60">Looking to buy</p>
                <p className="text-xl font-semibold mt-1">For Sale</p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                <HomeIcon
                  size={21}
                  className="text-white/70 transition-transform duration-200 group-hover:scale-110 group-hover:text-white"
                />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="max-w-6xl mx-auto px-6 md:px-16 py-18">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="py-8 md:py-0 md:px-10 first:pt-0 md:first:pl-0">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted mb-5">
                <ShieldCheck size={22} />
              </div>
              <h3 className="font-semibold text-lg">Verified listings</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Every property is checked before it goes live, so what you see
                is what&apos;s actually available.
              </p>
            </div>
            <div className="py-8 md:py-0 md:px-10">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted mb-5">
                <Search size={22} />
              </div>
              <h3 className="font-semibold text-lg">Easy search</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Filter by city, price, and property type to find exactly what
                fits your budget and needs.
              </p>
            </div>
            <div className="py-8 md:py-0 md:px-10 last:pb-0 md:last:pr-0">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted mb-5">
                <Users size={22} />
              </div>
              <h3 className="font-semibold text-lg">Local support</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Our team knows the local market and is here to help, from your
                first inquiry to closing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 md:px-14 py-14">
          <div className="text-center max-w-xl mx-auto">
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Simple process
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-medium mt-2">
              How it works
            </h2>
            <p className="text-muted-foreground mt-3">
              Finding your next property doesn&apos;t have to be complicated.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
            <div className="relative rounded-2xl border border-border bg-background p-7">
              <span className="text-sm font-semibold text-muted-foreground">
                01
              </span>
              <h3 className="font-semibold text-xl mt-8">Search</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Filter by city, price, and property type until you find places
                worth a closer look.
              </p>
            </div>
            <div className="relative rounded-2xl border border-border bg-background p-7">
              <span className="text-sm font-semibold text-muted-foreground">
                02
              </span>
              <h3 className="font-semibold text-xl mt-8">Connect</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Reach out directly to the listing owner or our team to ask
                questions or book a visit.
              </p>
            </div>
            <div className="relative rounded-2xl border border-border bg-background p-7">
              <span className="text-sm font-semibold text-muted-foreground">
                03
              </span>
              <h3 className="font-semibold text-xl mt-8">Move in</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Finalize the details and get the keys, whether you&apos;re
                renting or buying.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="max-w-3xl mx-auto px-6 py-14 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Mail size={21} />
          </div>
          <h2 className="font-heading text-3xl font-medium mt-5">
            Have questions?
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto leading-relaxed">
            Whether you&apos;re renting, buying, or listing a property, our team
            is happy to help.
          </p>
          <Link href="/contact">
            <Button className="mt-7" variant="outline">
              Contact us <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>

      <section className="border-t border-border bg-muted/40">
        <div className="max-w-3xl mx-auto px-6 py-14 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            For property owners
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-medium mt-3">
            Have a property to list?
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto leading-relaxed">
            Reach renters and buyers looking for their next place across
            Albania.
          </p>
          <Link href="/add-listing">
            <Button size="lg" className="mt-8">
              List your property <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
