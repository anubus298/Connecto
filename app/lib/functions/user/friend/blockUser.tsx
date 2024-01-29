"use server";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/supabase/supabase";
async function blockUserAction(user_2_id: string) {
  if (!user_2_id) {
    return 0;
  }
  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: target, error } = await supabase
      .from("friends")
      .select("friendship_id")
      .filter("user_id_1", "in", `("${user.id}","${user_2_id}")`)
      .filter("user_id_2", "in", `("${user.id}","${user_2_id}")`)
      .limit(1)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    if (target?.friendship_id) {
      const { data, error } = await supabase
        .from("friends")
        .update({ status: "blocked", action_user_id: user.id })
        .eq("friendship_id", target.friendship_id);
      if (error) {
        throw new Error(error.message);
      }
    } else {
      const { data, error } = await supabase.from("friends").insert([
        {
          action_user_id: user.id,
          status: "blocked",
          user_id_1: user.id,
          user_id_2: user_2_id,
        },
      ]);
      if (error) {
        throw new Error(error.message);
      }
    }
  }
}

export default blockUserAction;
