import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export const signOutAction = async () => {
  "use server";

  const supabase = createServerActionClient({ cookies });

  await supabase.auth.signOut();
  redirect("/");
};
