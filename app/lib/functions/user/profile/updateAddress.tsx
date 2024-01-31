"use server";
import { Database } from "@/utils/supabase/supabase";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { safeString } from "@/app/lib/zod/schemas";
export const updateAddressAction = async (formData: FormData) => {
  const supabase = createServerActionClient<Database>({ cookies });
  const address = formData.get("address") as string;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    try {
      safeString.parse(address);
    } catch (error) {
      throw new Error("invalid address");
    }
    const { data, error } = await supabase
      .from("personal_info")
      .update({ address: address })
      .eq("id", user.id);
    if (error) {
      throw new Error(error.hint);
    }
  }
};
