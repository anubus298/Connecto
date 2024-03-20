"use server";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/supabase/supabase";
async function unblockUserAction(user_2_id?: string) {
  if (!user_2_id) {
    return 0;
  }
  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data, error } = await supabase
      .from("friends")
      .delete()
      .or(
        `(user_id_1.in.("${user.id}","${user_2_id}"))and(user_id_2.in.("${user.id}","${user_2_id}"))`
      );

    if (error) throw new Error(error.message);
    else return 1;
  } else return 0;
}

export default unblockUserAction;
