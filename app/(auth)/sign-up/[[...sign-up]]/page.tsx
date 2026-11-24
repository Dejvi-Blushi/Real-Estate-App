import {SignUp} from "@clerk/nextjs";
import AuthShell from "../../_components/AuthShell";

export default function Page() {
  return (
    <AuthShell>
      <SignUp
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
