import { Database, Tables } from "@/utils/supabase/supabase";
import {
  createServerComponentClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Main_communities from "./components/main_communities";
type PreviewGroup = {
  name: string;
  id: number;
  logo_url: string | null;
};
async function Page() {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookiesStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: groups } = await supabase
    .from("group_members")
    .select("group:group_id(name,logo_url,id)")
    .returns<
      {
        group: PreviewGroup;
      }[]
    >();
  return <Main_communities groups={groups} />;
}

export default Page;
