import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export const finishAccountAction = async (formData: FormData) => {
  "use server";
  const avatarFile = formData.get("avatarFile") as File;
  const username = formData.get("username") as string;
  const supabase = createServerActionClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: fileData, error: fileError } = await supabase.storage
      .from("avatars")
      .upload(`public/${user.id.slice(0, 10) + "av"}.png`, avatarFile, {
        cacheControl: "3600",
        upsert: false,
      });
    if (fileError) {
      return redirect(
        "/constructors/finishAccount?message=error accrued at file : " +
          fileError.message
      );
    }
    const { data, error } = await supabase
      .from("profiles")
      .update({
        avatar_url: fileData?.path,
        username: username,
        is_first_initialised: true,
      })
      .eq("id", user?.id);
    if (error) {
      return redirect(
        "/constructors/finishAccount?message=error accrued : " + error.message
      );
    }
  } else {
    return redirect("/auth/signIn");
  }

  return redirect("/");
};
