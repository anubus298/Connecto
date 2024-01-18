import { cookies } from "next/headers";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";

export const postAction = async (formData: FormData) => {
  "use server";
  try {
    const cookieStore = cookies();
    const supabase = createServerActionClient({ cookies });
    const content = formData.get("content") as string;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("posts")
      .insert([{ content: content, user_id: user?.id }]);
  } catch (error: any) {
    return error.message;
  }
  revalidatePath("/home");
};
