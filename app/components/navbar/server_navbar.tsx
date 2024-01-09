import { signOutAction } from "@/app/lib/functions/auth/signOut";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Primary_navbar from "./primary_navbar";

async function Server_Navbar() {
  const cookiesStore = cookies();
  const supabase = createClient(cookiesStore);
  await supabase.auth.getSession();
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
    <Primary_navbar
      profile={profile?.[0]}
      avatar={data?.signedUrl as string}
      signOutAction={signOutAction}
    />
  );
}

export default Server_Navbar;
