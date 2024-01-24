"use server";

import { cookies } from "next/headers";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/supabase/supabase";
async function SendMessageAction(conversation_id: string, formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies });
  const content = (formData.get("content") as string) ?? "";
  if (content.length === 0) {
    return 0;
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user && content) {
    const { data, error } = await supabase.from("messages").insert({
      content: content,
      conversation_id: conversation_id,
      sender_id: user.id,
      is_read: false,
    });
    if (error) {
      throw new Error(error.message);
    }
  }
}

export default SendMessageAction;
