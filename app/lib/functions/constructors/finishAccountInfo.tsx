import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export const finishAccountAction = async (formData: FormData) => {
  "use server";
  const avatarFile = formData.get("avatarFile") as File;
  const username = formData.get("username") as string;
  const supabase = createServerActionClient({ cookies });
  if (avatarFile.size > 4194304) {
    return redirect(
      "/constructors/finishAccount?message=Image size limit is 4mb"
    );
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: fileData, error: fileError } = await supabase.storage
      .from("avatars")
      .upload(
        `public/${user.id}/profile_v1.${avatarFile.name.split(".")[1]}`,
        avatarFile,
        {
          cacheControl: "3600",
          upsert: true,
        }
      );
    if (fileError) {
      return redirect(
        "/constructors/finishAccount?message=error accrued at file uploading ,try again: "
      );
    }
    const { data, error } = await supabase
      .from("profiles")
      .update({
        avatar_url: fileData?.path,
        username: username,
      })
      .eq("id", user?.id);
    if (error) {
      return redirect(
        "/constructors/finishAccount?message=error accrued : " + error.hint
      );
    }
  } else {
    return redirect("/auth/signIn");
  }

  return redirect("/");
};
