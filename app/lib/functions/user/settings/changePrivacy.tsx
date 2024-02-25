"use server";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/supabase/supabase";
export default async function changePrivacyAction(
  keyForAction: string,
  value: string
) {
  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const updateTo: any = {};
  updateTo[keyForAction] = value;
  if (user) {
    const { data } = await supabase
      .from("user_privacy_settings")
      .update(updateTo)
      .eq("user_id", user?.id);
    return 1;
  } else {
    return 0;
  }
}
