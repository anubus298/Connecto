"use server";

import { cookies } from "next/headers";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/supabase/supabase";
async function AddCommentAction(id: number, formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies });
  const content = (formData.get("content") as string) ?? "";
  if (content.length === 0) {
    return 0;
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user && content) {
    const { data, error } = await supabase
      .from("comments")
      .insert({
        content: content,
        post_id: id,
        user_id: user.id,
      })
      .select();
    return data;
  }
}

export default AddCommentAction;
