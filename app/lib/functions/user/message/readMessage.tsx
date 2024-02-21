"use server";

import { cookies } from "next/headers";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/supabase/supabase";
async function readMessageAction(message_id: number) {
  const supabase = createServerActionClient<Database>({ cookies });
  if (!message_id) {
    return undefined;
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user && message_id) {
    const { data, error } = await supabase.rpc("set_message_as_read", {
      messageid: message_id,
    });

    if (error) {
      throw new Error(error.message);
    }
  }
}

export default readMessageAction;
