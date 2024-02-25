import { cookies } from "next/headers";

import { redirect } from "next/navigation";

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
  const supabase = createServerActionClient({ cookies });
  const { data, error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return redirect("/auth/passwordReset?error=1&message=Error happened");
  } else {
    return redirect("/auth/signIn");
  }
};
{
}
