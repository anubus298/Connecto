import { Database } from "@/utils/supabase/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { cookies } from "next/headers";
import Main_profile from "./components/main_profile";

async function Page({ searchParams }: { searchParams: { id?: string } }) {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookiesStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  async function getMyProfile() {
    const { data: profile, error: profile_error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id as string);
    const { data: personal_info, error: personal_info_error } = await supabase
      .from("personal_info")
      .select("*")
      .eq("id", user?.id as string);

    let { data: friendsRaw, error: friends_error } = await supabase
      .from("friends")
      .select(
        "user_id_1,user_id_2,user_1:friends_user_id_1_fkey(id,username,avatar_url),user_2:friends_user_id_2_fkey(id,username,avatar_url)"
      )
      .or(`user_id_1.eq.${user?.id},user_id_2.eq.${user?.id}`)
      .eq("status", "accepted")
      .limit(9)
      .order("action_timestamp", { ascending: false });
    const friends = friendsRaw?.map((friend) => {
      if (friend.user_id_1 === user?.id) {
        const test = Object.fromEntries(
          Object.entries(friend).filter(([key]) => key !== "user_id_1")
        );
        test.friend = test.user_2;
        delete test["user_2"];
        delete test["user_1"];
        return test;
      } else if (friend.user_id_2 === user?.id) {
        const test = Object.fromEntries(
          Object.entries(friend).filter(([key]) => key !== "user_id_2")
        );
        test.friend = test.user_1;
        delete test["user_1"];
        delete test["user_2"];

        return test;
      }
    });
    return {
      profile: profile,
      friends: friends,
      personal_info: personal_info,
    };
  }
  async function getOtherProfile(id: string) {
    const { data: profile, error: profile_error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id as string);
    return profile;
  }

  if (!searchParams.id) {
    const {
      profile,
      friends,
      personal_info,
    }: { profile: any; friends: any; personal_info: any } =
      await getMyProfile();
    return (
      profile && (
        <Main_profile
          profile={profile[0]}
          friends={friends}
          personal_info={personal_info?.[0]}
          is_other={false}
        />
      )
    );
  } else {
    const otherProfile = await getOtherProfile(searchParams.id as string);
    return (
      otherProfile && (
        <Main_profile
          friends={null}
          profile={otherProfile[0]}
          is_other={true}
        />
      )
    );
  }
}

export default Page;
