import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Primary_navbar from "./primary_navbar";
export const revalidate = 0;
async function Server_Navbar() {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookiesStore });

  const {
    data: { user },
    error: user_error,
  } = await supabase.auth.getUser();

  const { data: profile, error: profile_error } = await supabase
    .from("profiles")
    .select("avatar_url,username")
    .eq("id", user?.id as string);
  const { data, error } = await supabase.storage
    .from("avatars")
    .createSignedUrl(profile?.[0].avatar_url as string, 3600);
  return (
    <Primary_navbar profile={profile?.[0]} avatar={data?.signedUrl as string} />
  );
}

export default Server_Navbar;
