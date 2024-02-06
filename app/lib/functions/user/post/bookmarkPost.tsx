"use server";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/supabase/supabase";
import { revalidatePath } from "next/cache";
async function bookmarkPostAction(id: number) {
  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data, error } = await supabase
      .from("bookmarks")
      .insert([{ post_id: id, user_id: user.id }]);
  }
  revalidatePath("/home/bookmarks");
}

export default bookmarkPostAction;
