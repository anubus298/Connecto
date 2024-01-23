import { Database, Tables } from "@/utils/supabase/supabase";
import {
  createServerComponentClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Main_messages from "./components/main_messages";
async function Page() {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookiesStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const conversations = await getConversations(supabase, user!.id);
  return <Main_messages conversations={conversations} />;
}

async function getConversations(
  supabase: SupabaseClient<Database, "public", Database["public"]>,
  user_id: string
) {
  const { data: conversations, error } = await supabase
    .from("conversations")
    .select(
      "*,user_1:user_id_1(avatar_url,username,id),user_2:user_id_2(avatar_url,username,id)"
    )
    .or(`user_id_1.eq.${user_id},user_id_2.eq.${user_id}`)
    .limit(30)
    .returns<NonNullable<Tables<"conversations">[]>>();

  return conversations;
}
export default Page;
