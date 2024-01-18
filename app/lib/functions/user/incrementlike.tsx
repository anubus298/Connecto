"use server";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
async function incrementLikeAction(id: number) {
  const supabase = createServerActionClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data, error } = await supabase
      .from("likes")
      .insert([{ post_id: id, user_id: user.id }]);
  }
}

export default incrementLikeAction;
