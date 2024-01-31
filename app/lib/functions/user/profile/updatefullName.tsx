"use server";
import { Database } from "@/utils/supabase/supabase";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NameSchema } from "@/app/lib/zod/schemas";
export const updateFullNameAction = async (formData: FormData) => {
  const supabase = createServerActionClient<Database>({ cookies });
  const fullName = formData.get("fullName") as string;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    try {
      NameSchema.parse(fullName);
    } catch (error) {
      throw new Error("invalid fullName");
    }
    const { data, error } = await supabase
      .from("personal_info")
      .update({ full_name: fullName })
      .eq("id", user.id);
    if (error) {
      throw new Error(error.hint);
    }
  }
};
