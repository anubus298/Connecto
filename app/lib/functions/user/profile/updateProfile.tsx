"use server";
import { Database } from "@/utils/supabase/supabase";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const updateProfileAction = async (
  prevState: any,
  formData: FormData
) => {
  const supabase = createServerActionClient<Database>({ cookies });
  const coverFile = formData.get("profileFile") as File;
  if (coverFile.size > 4194304) {
    return {
      message: "file max size : 4mb",
    };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: oldAvatarPath } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .limit(1)
      .single();
    const { data: test, error: testError } = await supabase.storage
      .from("avatars")
      .list(`public/${user.id}`, {
        limit: 100,
        offset: 0,
      });
    const profileVersion: number = test?.length ?? 0;
    const { data: fileData, error: fileError } = await supabase.storage
      .from("avatars")
      .upload(
        `public/${user.id}/profile_v${profileVersion + 1}.${coverFile.name.split(".")[1]}`,
        coverFile,
        {
          cacheControl: "3600",
        }
      );
    if (fileError) {
      return {
        message: fileError.message,
      };
    }
    const { data, error } = await supabase
      .from("profiles")
      .update({
        avatar_url: fileData?.path,
      })
      .eq("id", user?.id);
    if (error) {
      return {
        message: error.message,
      };
    }
    return {
      path: fileData.path,
    };
  }
};
