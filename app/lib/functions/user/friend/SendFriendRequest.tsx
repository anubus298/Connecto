"use server";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/supabase/supabase";
async function sendFriendRequestAction(id_to_request_friend?: string | null) {
  if (!id_to_request_friend) {
    return 0;
  }
  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data, error } = await supabase.from("friends").insert([
      {
        user_id_1: user.id,
        user_id_2: id_to_request_friend,
        action_user_id: user.id,
        status: "pending",
      },
    ]);
  }
}

export default sendFriendRequestAction;
