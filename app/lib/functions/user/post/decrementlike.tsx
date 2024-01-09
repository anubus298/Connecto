import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
async function decrementlikeAction(id: string) {
  "use server";
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    await supabase.auth.refreshSession();
    const {
      data: { user },
    } = await supabase.auth.getUser();
  } catch (error) {}
}

export default decrementlikeAction;
