import {SignIn} from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 min-h-screen">
        <div className="w-full max-w-lg ">
          <SignIn
            appearance={{
              elements: {
                rootBox: {
                  width: "100%"
                },
                cardBox: {
                  width: "100%"
                }
              }
            }}
          />
        </div>
      </div>

      <div className="relative hidden md:block">
        <Image
          src="/real-estate1.jpg"
          alt="Real estate image"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
