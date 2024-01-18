"use server";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/supabase/supabase";
async function addBioAction(formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies });
  const bio = formData.get("bio") as string;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data, error } = await supabase
      .from("profiles")
      .update({ bio: bio })
      .eq("id", user.id);
  }
}

export default addBioAction;
