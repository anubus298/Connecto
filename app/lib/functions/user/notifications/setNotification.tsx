"use server";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/supabase/supabase";
async function setNotificationAction(type: "seen" | "read", id: number) {
  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    if (type === "seen") {
      await supabase
        .from("notifications")
        .update({ is_seen: true })
        .eq("notification_id", id);
    } else if (type === "read") {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("notification_id", id);
    }
  }
}

export default setNotificationAction;
