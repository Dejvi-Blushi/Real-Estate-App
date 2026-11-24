import {SignIn} from "@clerk/nextjs";
import AuthShell from "../../_components/AuthShell";

export default function Page() {
  return (
    <AuthShell>
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
    </AuthShell>
  );
}
