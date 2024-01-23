"use server";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/supabase/supabase";
async function acceptFriendRequestAction(friendship_id?: number) {
  if (!friendship_id) {
    return 0;
  }
  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data, error } = await supabase
      .from("friends")
      .update({
        action_user_id: user.id,
        status: "accepted",
      })
      .eq("friendship_id", friendship_id);
    if (error) {
      throw new Error(error.message);
    }
  }
}

export default acceptFriendRequestAction;
