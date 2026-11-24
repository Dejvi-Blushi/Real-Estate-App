import "server-only";

import {auth} from "@clerk/nextjs/server";
import {createServerClient} from "@supabase/ssr";

/**
 * Supabase client for Server Components and Server Actions.
 *
 * Auth is owned by Clerk: the Clerk session JWT is sent as the Supabase
 * access token, and RLS authorizes requests with it. Supabase's own auth
 * cookies are therefore never used, so the cookie handlers stay empty.
 * Create a new client per request — never share it across renders.
 */
export async function createSupabaseServerClient() {
  const {getToken} = await auth();
  const token = await getToken();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {}
      },
      ...(token ? {global: {headers: {Authorization: `Bearer ${token}`}}} : {})
    }
  );
}
