import { getConversations, getFriends } from "@/app/home/messages/page";
import { Database } from "@/utils/supabase/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Main_floating_messages from "./main_floating_messages";

async function Server_floating_messages() {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookiesStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const conversations = await getConversations(supabase, user?.id);
  const friends = await getFriends(supabase, user?.id);
  return (
    <Main_floating_messages
      //@ts-ignore
      conversations={conversations}
      //@ts-ignore
      friends={friends}
      my_id={user!.id}
    />
  );
}

export default Server_floating_messages;
