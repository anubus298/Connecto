"use server";
import { cookies } from "next/headers";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/supabase/supabase";

import { revalidatePath } from "next/cache";
async function deletePostAction(id: number) {
  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data, error } = await supabase.from("posts").delete().eq("id", id);
    revalidatePath("/home");
  }
}

export default deletePostAction;
