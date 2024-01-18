import { Database } from "@/utils/supabase/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Main_profile from "./components/main_profile";
export const revalidate = 0;
async function Page() {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookiesStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile, error: profile_error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id as string);
  const { data: personal_info, error: personal_info_error } = await supabase
    .from("personal_info")
    .select("*")
    .eq("id", user?.id as string);

  return (
    profile && (
      <Main_profile profile={profile[0]} personal_info={personal_info?.[0]} />
    )
  );
}

export default Page;
