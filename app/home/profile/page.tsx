import { Database } from "@/utils/supabase/supabase";
import {
  createServerComponentClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs";

import { cookies } from "next/headers";
import Other_profile from "./components/other/other_profile";
import Personal_profile from "./components/personal/personal_profile";
import { getPosts } from "../page";
import { getFriends } from "../messages/page";
export const revalidate = 0;
async function Page({ searchParams }: { searchParams: { id?: string } }) {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookiesStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const my_profile = await getMyProfileData(supabase, user?.id);

  if (!searchParams.id || searchParams.id == user?.id) {
    const posts = await getPosts(supabase, user?.id, user?.id, {
      column: "created_at",
      status: false,
    });
    const postMedia = await getPostMedia(supabase, user?.id, 9);
    const { profile, friends } = await getMyProfile(supabase, user?.id);
    return (
      profile && (
        <Personal_profile
          //@ts-ignore
          posts={posts}
          profile={profile}
          self_id={user?.id}
          mediaUrl={postMedia}
          //@ts-ignore
          friends={friends}
          //@ts-ignore
        />
      )
    );
  } else {
    const otherProfile = await getOtherProfile(
      searchParams.id as string,
      supabase
    );
    const postMedia = await getPostMedia(supabase, searchParams.id, 9);
    const friends = await getFriends(supabase, searchParams.id);
    const posts: any = await getPosts(supabase, user?.id, searchParams.id, {
      column: "created_at",
      status: false,
    });
    return (
      otherProfile && (
        <Other_profile
          posts={posts}
          mediaUrl={postMedia}
          //@ts-ignore
          friendship={{
            id: otherProfile.is_friend?.friendship_id,
            is_my_action: otherProfile.is_friend?.action_user_id == user!.id,
            status:
              otherProfile.is_friend?.status === "pending"
                ? "sent"
                : otherProfile.is_friend?.status === "accepted"
                  ? "added"
                  : "none",
          }}
          //@ts-ignore
          my_profile={my_profile}
          self_id={user?.id} //@ts-ignore
          friends={friends} //@ts-ignore
          profile={otherProfile.profile}
        />
      )
    );
  }
}

async function getMyProfile(
  supabase: SupabaseClient<Database, "public", Database["public"]>,
  user_id?: string
) {
  const { data: profile, error: profile_error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user_id as string)
    .limit(1)
    .single();

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
  return {
    profile: profile,
    friends: friends,
  };
}

async function getOtherProfile(
  id: string,
  supabase: SupabaseClient<Database, "public", Database["public"]>
) {
  const { data: profile, error: profile_error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id as string)
    .limit(1)
    .single();
  const { data: friendship, error: friendship_error } = await supabase
    .from("friends")
    .select("friendship_id,status,action_user_id")
    .or(`user_id_1.eq.${id},user_id_2.eq.${id}`)
    .limit(1)
    .single();
  return { profile: profile, is_friend: friendship };
}

async function getMyProfileData(
  supabase: SupabaseClient<Database, "public", Database["public"]>,
  user_id: string | undefined
) {
  const { data: profile, error: profile_error } = await supabase
    .from("profiles")
    .select("avatar_url,username")
    .eq("id", user_id as string)
    .limit(1)
    .single();
  return profile;
}
async function getPostMedia(
  supabase: SupabaseClient<Database, "public", Database["public"]>,
  user_id: string | undefined,
  limit: number
) {
  if (user_id) {
    const { data } = await supabase.rpc("getmedia_url", {
      t_user_id: user_id,
      limit_count: limit,
    });
    if (data) {
      const result = data
        .map((postMedia) => {
          return {
            id: postMedia.id,
            medias: postMedia.urls
              .slice(postMedia.urls.lastIndexOf("/") + 1)
              .split(",")
              .filter((asset) => asset.split(".")[1] !== "mp4"),
            baseUrl: postMedia.urls.slice(
              0,
              postMedia.urls.lastIndexOf("/") + 1
            ),
          };
        })
        .filter((x) => x.medias.length !== 0);
      return result;
    } else return null;
  } else return null;
}
export default Page;
