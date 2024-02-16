import { Database, Tables } from "@/utils/supabase/supabase";
import {
  createServerComponentClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const revalidate = 0;
import Main_messages from "./components/main_messages";
import { getMyProfile } from "../page";
async function Page() {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookiesStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const conversations = await getConversations(supabase, user!.id);
  let friends = await getFriends(supabase, user!.id);
  friends = friends?.filter(
    (friend) =>
      conversations?.findIndex(
        //@ts-ignore
        (conv) => conv?.user_id?.id == friend?.friend?.id
      ) === -1
  );
  const my_profile = await getMyProfile(supabase, user!.id);
  return (
    <Main_messages
      //@ts-ignore
      my_id={user?.id}
      my_profile={my_profile}
      //@ts-ignore
      conversations={conversations}
      //@ts-ignore
      friends={friends}
    />
  );
}

export async function getConversations(
  supabase: SupabaseClient<Database, "public", Database["public"]>,
  user_id?: string
) {
  const { data: conversations, error } = await supabase
    .from("conversations")
    .select(
      "conversation_id,user_1:user_id_1(avatar_url,username,id),user_2:user_id_2(avatar_url,username,id)"
    )
    .or(`user_id_1.eq.${user_id},user_id_2.eq.${user_id}`)
    .eq("status", "active")
    .limit(30)
    .returns<NonNullable<Tables<"conversations">[]>>();

  const result = conversations?.map((conv) => {
    const mimic = Object.fromEntries(
      Object.entries(conv)
        .filter(([key, value]) => {
          //@ts-ignore
          return value?.id !== user_id;
        })
        .map(([entryKey, entryValue]) => {
          if (entryKey === "user_1" || entryKey === "user_2") {
            return ["user_id", entryValue];
          } else {
            return [entryKey, entryValue];
          }
        })
    );
    return mimic;
  });

  return result;
}
export async function getFriends(
  supabase: SupabaseClient<Database, "public", Database["public"]>,
  user_id?: string
) {
  let { data: friendsRaw, error: friends_error } = await supabase
    .from("friends")
    .select(
      "user_id_1,user_id_2,user_1:friends_user_id_1_fkey(id,username,avatar_url),user_2:friends_user_id_2_fkey(id,username,avatar_url)"
    )
    .or(`user_id_1.eq.${user_id},user_id_2.eq.${user_id}`)
    .eq("status", "accepted")
    .limit(9)
    .order("action_timestamp", { ascending: false });
  const friends = friendsRaw?.map((friend) => {
    if (friend.user_id_1 === user_id) {
      const test = Object.fromEntries(
        Object.entries(friend).filter(([key]) => key !== "user_id_1")
      );
      test.friend = test.user_2;
      delete test["user_2"];
      delete test["user_1"];
      return test;
    } else if (friend.user_id_2 === user_id) {
      const test = Object.fromEntries(
        Object.entries(friend).filter(([key]) => key !== "user_id_2")
      );
      test.friend = test.user_1;
      delete test["user_1"];
      delete test["user_2"];
      return test;
    }
  });
  return friends;
}
export default Page;
