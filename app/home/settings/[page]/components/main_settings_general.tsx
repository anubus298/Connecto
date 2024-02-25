import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import BlockList from "./subComponents/blockList";
import ThemePallete from "./subComponents/themepallete";
import { cookies } from "next/headers";
import { Database } from "@/utils/supabase/supabase";
async function Main_settings_general() {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookiesStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let { data: friendsRaw, error: friends_error } = await supabase
    .from("friends")
    .select(
      "user_id_1,user_id_2,user_1:friends_user_id_1_fkey(id,username,avatar_url),user_2:friends_user_id_2_fkey(id,username,avatar_url)"
    )
    .or(`user_id_1.eq.${user!.id},user_id_2.eq.${user!.id}`)
    .eq("status", "blocked")
    .eq("action_user_id", user!.id)
    .limit(300)
    .order("action_timestamp", { ascending: false });
  const blockedUsers = friendsRaw?.map((friend) => {
    if (friend.user_id_1 === user!.id) {
      const test = Object.fromEntries(
        Object.entries(friend).filter(([key]) => key !== "user_id_1")
      );
      test.friend = test.user_2;
      delete test["user_2"];
      delete test["user_1"];
      return test;
    } else if (friend.user_id_2 === user!.id) {
      const test = Object.fromEntries(
        Object.entries(friend).filter(([key]) => key !== "user_id_2")
      );
      test.friend = test.user_1;
      delete test["user_1"];
      delete test["user_2"];

      return test;
    }
  });
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-12">
        <h6 className="mb-1 h3">General</h6>
        <hr></hr>
      </div>
      <BlockList
        // @ts-ignore
        blockedUsers={blockedUsers}
      />
      <ThemePallete />
    </div>
  );
}

export default Main_settings_general;
