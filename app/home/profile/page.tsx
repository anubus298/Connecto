import { postAction } from "@/app/lib/functions/user/post/addPost";
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
  async function getUserPosts(user_id?: string) {
    if (!user_id) return null;
    const { data: posts, error: error } = await supabase
      .from("posts")
      .select("*,profiles(*),posts(*)")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });
    const posts_data = await Promise.all(
      (posts || []).map(async (post) => {
        try {
          let {
            data: like_related_to_post,
            error: like_related_to_post_error,
          } = await supabase
            .from("likes")
            .select()
            .eq("user_id", user!.id)
            .eq("post_id", post.id);
          return {
            ...post,
            is_liked: like_related_to_post?.length === 1,
          };
        } catch (error) {
          return {
            ...post,
            is_liked: false,
          };
        }
      })
    );
    return posts_data;
  }
  const posts: any = await getUserPosts(searchParams?.id ?? user?.id);
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
          posts={posts}
          postAction={postAction}
          profile={profile[0]}
          self_id={user?.id}
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
          posts={posts}
          postAction={postAction}
          self_id={user?.id}
          friends={null}
          profile={otherProfile[0]}
          is_other={true}
        />
      )
    );
  }
}

export default Page;
