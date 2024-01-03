export const fetchCache = "force-no-store";
import { cookies } from "next/headers";

import { createClient } from "@/utils/supabase/server";
import Main from "./components/main";

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let { data: profiles } = await supabase.from("profiles").select("*");

  return <Main profile={profiles} user={user} />;
}
