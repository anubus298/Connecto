"use server";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/supabase/supabase";
async function decrementLikeOnCommentAction(id: number) {
  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data, error } = await supabase
      .from("comments_like")
      .delete()
      .eq("comment_id", id)
      .eq("user_id", user.id);
  }
}

export default decrementLikeOnCommentAction;
