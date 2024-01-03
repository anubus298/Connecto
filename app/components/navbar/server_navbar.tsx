import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Primary_navbar from "./primary_navbar";

async function Server_Navbar() {
  const cookiesStore = cookies();
  const supabase = createClient(cookiesStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_url,username")
    .eq("id", user?.id as string);
  const { data, error } = await supabase.storage
    .from("avatars")
    .createSignedUrl(profile?.[0].avatar_url as string, 3600);
  return (
    <Primary_navbar user={profile![0]} avatar={data?.signedUrl as string} />
  );
}

export default Server_Navbar;
