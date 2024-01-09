"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
async function incrementLikeAction(id: number) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  await supabase.auth.refreshSession();
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
