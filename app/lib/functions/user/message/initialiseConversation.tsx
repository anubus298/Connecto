"use server";

import { cookies } from "next/headers";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/supabase/supabase";
async function initialiseConversationAction(user_id_2: string) {
  const supabase = createServerActionClient<Database>({ cookies });
  if (user_id_2.length === 0) {
    return undefined;
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user && user_id_2) {
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id_1: user.id,
        user_id_2: user_id_2,
        status: "active",
      })
      .select("conversation_id")
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data?.conversation_id;
  }
}

export default initialiseConversationAction;
