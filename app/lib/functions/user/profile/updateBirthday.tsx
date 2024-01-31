"use server";
import { Database } from "@/utils/supabase/supabase";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { ageGreaterThan18Schema } from "@/app/lib/zod/schemas";
export const updateBirthdayAction = async (formData: FormData) => {
  const supabase = createServerActionClient<Database>({ cookies });
  const birthday = formData.get("birthday") as string;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    try {
      ageGreaterThan18Schema.parse(birthday);
    } catch (error) {
      throw new Error("invalid fullName");
    }
    const { data, error } = await supabase
      .from("personal_info")
      .update({ birthday: birthday })
      .eq("id", user.id);
    if (error) {
      throw new Error(error.hint);
    }
  }
};
