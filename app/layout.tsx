import type {Metadata} from "next";
import {Geist, Geist_Mono, Inter} from "next/font/google";
import "./globals.css";
import {cn} from "@/lib/utils";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import {ClerkProvider} from "@clerk/nextjs";
import {Toaster} from "sonner";

const inter = Inter({subsets: ["latin"], variable: "--font-sans"});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "T&T Group",
  description:
    "Discover your perfect property in Albania. Browse our curated listings for apartments, villas, and commercial real estate for sale and rent in many Albanian cities."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body className="min-h-screen flex flex-col">
        <ClerkProvider>
          <header>
            <Header />
          </header>
          <main className="mt-18 flex-1"> {children}</main>
          <Toaster />
          <footer>
            <Footer />
          </footer>
        </ClerkProvider>
      </body>
    </html>
  );
}
