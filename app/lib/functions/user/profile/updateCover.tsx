"use server";
import { Database } from "@/utils/supabase/supabase";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const updateCoverAction = async (formData: FormData) => {
  const coverFile = formData.get("coverFile") as File;

  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: fileData, error: fileError } = await supabase.storage

      .from("covers")
      .upload(`public/${user.id.slice(0, 10) + "cv"}.png`, coverFile, {
        cacheControl: "10",
        upsert: true,
      });
    if (fileError) {
      throw new Error(fileError.message);
    }
    const { data, error } = await supabase
      .from("profiles")
      .update({
        cover_url: fileData?.path,
      })
      .eq("id", user?.id);
    if (error) {
      throw new Error(error.message);
    }
  }
};
