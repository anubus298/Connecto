"use server";
import { Database } from "@/utils/supabase/supabase";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { phoneNumberSchema } from "@/app/lib/zod/schemas";
export const updatePhoneNumberAction = async (formData: FormData) => {
  const supabase = createServerActionClient<Database>({ cookies });
  const phoneNumber = formData.get("phoneNumber") as string;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    try {
      phoneNumberSchema.parse(phoneNumber);
    } catch (error) {
      throw new Error("invalid address");
    }
    const { data, error } = await supabase
      .from("personal_info")
      .update({ phone_number: phoneNumber })
      .eq("id", user.id);
    if (error) {
      throw new Error(error.hint);
    }
  }
};
