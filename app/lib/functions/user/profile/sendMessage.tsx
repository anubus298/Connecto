"use server";
import { Database } from "@/utils/supabase/supabase";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function sendMessageAction(user_id_2: string, content: string) {
  const supabase = createServerActionClient<Database>({ cookies });
  if (user_id_2.length === 0 || content.length === 0) {
    return undefined;
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user && user_id_2) {
    const { data: alreadyExisted, error: alreadyExistedError } = await supabase
      .from("conversations")
      .select("*")
      .or(
        `and(user_id_1.eq.${user_id_2},user_id_2.eq.${user.id}),and(user_id_2.eq.${user_id_2},user_id_1.eq.${user.id})`
      )
      .limit(1)
      .single();
    if (alreadyExistedError) {
      throw new Error(alreadyExistedError.message);
    }
    if (!alreadyExisted) {
      const { data, error } = await supabase
        .from("conversations")
        .insert({
          user_id_1: user.id,
          user_id_2: user_id_2,
          status: "active",
        })
        .select("conversation_id")
        .limit(1)
        .single();
      if (error) {
        throw new Error(error.message);
      }

      const { data: dataz, error: errorz } = await supabase
        .from("messages")
        .insert({
          content: content,
          sender_id: user.id,
          conversation_id: data.conversation_id,
        });
    } else {
      const { data, error } = await supabase.from("messages").insert({
        content: content,
        sender_id: user.id,
        conversation_id: alreadyExisted.conversation_id,
      });
    }
  }
}
