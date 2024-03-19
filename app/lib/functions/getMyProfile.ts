import { SupabaseClient } from "@supabase/supabase-js";

export async function getMyProfile(
  supabase: SupabaseClient<any, "public", any>,
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
