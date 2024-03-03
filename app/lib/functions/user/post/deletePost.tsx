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
    const { data: list, error } = await supabase.storage
      .from("posts")
      .list(`public/${user.id}/${id}`);
    if (error) {
      throw new Error(
        `message : ${error.message},cause : ${error.cause},name : ${error.name}`
      );
    }
    if (list && list?.length > 0) {
      const filesToRemove = list.map(
        (x) => `public/${user.id}/${id}/${x.name}`
      );

      const { data, error } = await supabase.storage
        .from("posts")
        .remove(filesToRemove);
      if (error) {
        throw new Error(
          `message : ${error.message},cause : ${error.cause},name : ${error.name}`
        );
      }
      const { data: post_delete, error: error_delete } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);
      if (error_delete) {
        throw new Error(
          `message : ${error_delete.message},details : ${error_delete.details},hint : ${error_delete.hint}`
        );
      }
    }
    const { data: post_delete, error: error_delete } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);
    if (error_delete) {
      throw new Error(
        `message : ${error_delete.message},details : ${error_delete.details},hint : ${error_delete.hint}`
      );
    }
  }
  revalidatePath("/home");
}

export default deletePostAction;
