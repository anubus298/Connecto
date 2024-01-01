import { headers, cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import { passwordSchema } from "../../zod/schemas";
import { emailSchema } from "../../zod/schemas";
export const signUp = async (formData: FormData) => {
  "use server";
  const origin = headers().get("origin");
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  if (password !== confirmPassword) {
    return redirect("/auth/signUp?error=1&message=Passwords doesn't matches");
  }
  //zod checking
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

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return redirect("/auth/signUp?error=1&message=Could not authenticate user");
  }

  return redirect(
    "/auth/signUp?error=0&message=Check email to continue sign in process"
  );
};
