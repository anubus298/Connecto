import { cookies } from "next/headers";

import { redirect } from "next/navigation";

import { emailSchema } from "../../zod/schemas";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
3;
export const passwordResetAction = async (formData: FormData) => {
  "use server";
  const email = formData.get("email") as string;
  try {
    emailSchema.parse(email);
  } catch (_) {
    return redirect("/auth/passwordReset?error=1&message=Invalid Email");
  }
  const supabase = createServerActionClient({ cookies });
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo:
      process.env.NODE_ENV !== "production"
        ? "http://localhost:3000/auth/callback?isReset=true"
        : "https://connecto-nine.vercel.app/auth/callback?isReset=true",
  });
  if (error) {
    return redirect("/auth/passwordReset?error=1&message=Error happened");
  } else {
    return redirect(
      "/auth/passwordReset?message=verification mail was sent to your email"
    );
  }
};
