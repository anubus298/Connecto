"use server";

import { cookies } from "next/headers";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/supabase/supabase";
import { revalidatePath } from "next/cache";
async function deleteCommentAction(id: number) {
  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user && id) {
    const { data, error } = await supabase
      .from("comments")
      .delete()
      .eq("comment_id", id);
  }
}

export default deleteCommentAction;
