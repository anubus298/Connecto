import { Database } from "@/utils/supabase/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Main_community_create from "./components/main_community_create";
import { getMyProfile } from "../../page";

async function Page() {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookiesStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const my_profile = await getMyProfile(supabase, user?.id);
  const availableLogo = await supabase.storage.from("server").list("group");
  return (
    <Main_community_create
      my_profile={my_profile}
      availableLogo={availableLogo.data?.map((logo) => logo.name)}
    />
  );
}

export default Page;
