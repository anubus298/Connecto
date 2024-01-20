"use server";
import { cookies } from "next/headers";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/supabase/supabase";
async function shareToProfileAction(post_id: number) {
  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data, error } = await supabase
      .from("posts")
      .select("id")
      .eq("id", post_id);
    if (data) {
      //check if it exist a share by the same user
      const { data: check_data, error: check_error } = await supabase
        .from("posts")
        .select("id")
        .eq("share_source", post_id)
        .eq("user_id", user.id);
      if (check_data?.length === 0) {
        const { data: shared_data, error: shared_error } = await supabase
          .from("posts")
          .insert([
            { user_id: user.id, share_source: post_id, type: "shared" },
          ]);
      }
    }
  }
}

export default shareToProfileAction;
