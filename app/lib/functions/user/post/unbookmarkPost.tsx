"use server";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/supabase/supabase";
import { revalidatePath } from "next/cache";
async function unbookmarkPostAction(id: number) {
  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data, error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("post_id", id);
    if (error) {
      throw new Error(error.message);
    }
  }

  revalidatePath("/home/bookmarks");
}

export default unbookmarkPostAction;
