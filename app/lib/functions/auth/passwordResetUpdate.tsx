import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Database } from "@/utils/supabase/supabase";
import { passwordSchema } from "../../zod/schemas";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
3;
export const passwordResetUpdateAction = async (formData: FormData) => {
  "use server";
  const password = formData.get("password") as string;
  try {
    passwordSchema.parse(password);
  } catch (_) {
    return redirect("/auth/passwordReset?error=1&message=Invalid password");
  }
  const supabase = createServerActionClient<Database>({ cookies });

  const {
    data: { user },
    error,
  } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return redirect("/auth/passwordReset?error=1&message=Error happened");
  } else {
    const { data } = await supabase
      .from("personal_info")
      .update({ is_password_gonna_reset: false })
      .eq("id", user!.id);
    return redirect("/home");
  }
};
{
}
