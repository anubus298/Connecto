"use server";
import { cookies } from "next/headers";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/supabase/supabase";
import { revalidatePath } from "next/cache";
async function shareToProfileAction(post_id: number, formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies });
  const content = formData.get("content") as string;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data, error } = await supabase
      .from("posts")
      .select("id,user_id,type")
      .eq("id", post_id)
      .single();
    if (data && data.user_id !== user.id && data.type === "default") {
      const { data: shared_data, error: shared_error } = await supabase
        .from("posts")
        .insert([
          {
            user_id: user.id,
            share_source: post_id,
            type: "shared",
            content: content,
          },
        ]);
    }
  }
  revalidatePath("/home");
}

export default shareToProfileAction;
