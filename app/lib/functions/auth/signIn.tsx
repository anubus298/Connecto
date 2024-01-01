import { headers, cookies } from "next/headers";
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
    return redirect("/auth/signUp?error=1&message=Invalid Password");
  }
  try {
    emailSchema.parse(email);
  } catch (_) {
    return redirect("/auth/signUp?error=1&message=Invalid Email");
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return redirect("/auth/signIn?message=Could not authenticate user");
  }
  return redirect("/");
};
