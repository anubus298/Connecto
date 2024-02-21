import { Database } from "@/utils/supabase/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import Main_profile_settings from "./main_profile_settings";
import { redirect } from "next/navigation";

async function Page() {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookiesStore });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const my_profile = await getMyProfile(supabase, user?.id);
  if (!my_profile?.username) {
    redirect("/constructors/newAccount");
  }
  const personal_info = await getPersonalProfile(supabase, user?.id);
  return (
    <Main_profile_settings
      my_profile={my_profile}
      personal_info={personal_info}
    />
  );
}

async function getMyProfile(
  supabase: SupabaseClient<Database, "public", Database["public"]>,
  user_id?: string
) {
  const { data: profile, error: profile_error } = await supabase
    .from("profiles")
    .select("avatar_url,username")
    .eq("id", user_id as string)
    .limit(1)
    .single();
  return profile;
}
async function getPersonalProfile(
  supabase: SupabaseClient<Database, "public", Database["public"]>,
  user_id?: string
) {
  const { data: personal_info, error: personal_info_error } = await supabase
    .from("personal_info")
    .select("*")
    .eq("id", user_id as string)
    .limit(1)
    .single();
  return personal_info;
}
export default Page;
