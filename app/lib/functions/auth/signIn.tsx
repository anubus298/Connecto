import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import { emailSchema, passwordSchema } from "../../zod/schemas";
export const signIn = async (formData: FormData) => {
  "use server";
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    passwordSchema.parse(password);
  } catch (_) {
    return redirect("/auth/signIn?error=1&message=Invalid Password");
  }
  try {
    emailSchema.parse(email);
  } catch (_) {
    return redirect("/auth/signIn?error=1&message=Invalid Email");
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return redirect("/auth/signIn?error=1&message=Could not authenticate user");
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile, error: profile_error } = await supabase
    .from("profiles")
    .select("is_first_initialised")
    .eq("id", user?.id as string);
  const { data: personal_info, error: personal_info_error } = await supabase
    .from("personal_info")
    .select("is_first_initialised")
    .eq("id", user?.id as string);
  if (personal_info_error) {
    return redirect("/auth/signIn?error=1&message=Could not authenticate user");
  }
  if (!profile?.[0].is_first_initialised) {
    return redirect("/constructors/newAccount");
  } else if (!personal_info?.[0].is_first_initialised) {
    return redirect("/constructors/finishAccount");
  }
  if (profile) return redirect("/?islogged");
};
