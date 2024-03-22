"use server";

import { cookies } from "next/headers";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/supabase/supabase";
import { getMyProfile } from "@/app/home/page";

async function AddCommentAction(
  id: number,
  currentState: any,
  formData: FormData
) {
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
      .select()
      .single();
    if (error) {
      throw new Error(
        `currentState : ${currentState},id : ${id},formData : ${formData}`
      );
    }
    if (data) {
      let mimic = { ...data } as any;
      mimic["is_liked"] = false;
      mimic["is_self"] = false;
      let my_profile = await getMyProfile(supabase, user.id);
      mimic["profiles"] = {
        avatar_url: my_profile?.avatar_url,
        id: user.id,
        username: my_profile?.username,
      };
      return mimic;
    }
    return data;
  } else {
    return null;
  }
}

export default AddCommentAction;
