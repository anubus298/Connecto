"use server";
import { cookies } from "next/headers";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/supabase/supabase";
async function decrementLikeAction(id: number) {
  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data, error } = await supabase
      .from("likes")
      .delete()
      .eq("post_id", id)
      .eq("user_id", user.id);
  }
}

export default decrementLikeAction;
