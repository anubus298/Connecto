"use server";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Provider } from "@supabase/supabase-js";

export default async function OauthAction(provider: Provider) {
  const supabase = createServerActionClient({ cookies });
}
