"use server";
import { Database } from "@/utils/supabase/supabase";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const updateCoverAction = async (prevState: any, formData: FormData) => {
  const supabase = createServerActionClient<Database>({ cookies });
  const coverFile = formData.get("coverFile") as File;
  if (coverFile.size > 6291456) {
    return {
      message: "file max size : 6mb",
    };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: oldCoverPath } = await supabase
      .from("profiles")
      .select("cover_url")
      .eq("id", user.id)
      .limit(1)
      .single();

    const { data: test, error: testError } = await supabase.storage
      .from("covers")
      .list(`public/${user.id}`, {
        limit: 100,
        offset: 0,
      });
    const coverVersion: number = test?.length ?? 0;

    const { data: fileData, error: fileError } = await supabase.storage
      .from("covers")
      .upload(
        `public/${user.id}/cover_v${coverVersion + 1}.${coverFile.name.split(".")[1]}`,
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
        cover_url: fileData?.path,
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
