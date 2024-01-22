import { addPostAction } from "@/app/lib/functions/user/post/addPost";
import { Database } from "@/utils/supabase/supabase";
import {
  createServerComponentClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs";

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
  const profile: any = await getMyProfileData(supabase, user?.id);
  const posts: any = await getUserPosts(supabase, searchParams?.id ?? user?.id);
  if (!searchParams.id) {
    const {
      profile,
      friends,
      personal_info,
    }: { profile: any; friends: any; personal_info: any } = await getMyProfile(
      supabase,
      user?.id
    );
    return (
      profile && (
        <Main_profile
          posts={posts}
          postAction={addPostAction}
          profile={profile[0]}
          my_profile={profile}
          self_id={user?.id}
          friends={friends}
          personal_info={personal_info?.[0]}
          is_other={false}
        />
      )
    );
  } else {
    const otherProfile = await getOtherProfile(
      searchParams.id as string,
      supabase
    );
    return (
      otherProfile && (
        <Main_profile
          posts={posts}
          postAction={addPostAction}
          my_profile={profile}
          self_id={user?.id}
          friends={null}
          profile={otherProfile[0]}
          is_other={true}
        />
      )
    );
  }
}

async function getMyProfile(
  supabase: SupabaseClient<any, "public", any>,
  user_id: string | undefined
) {
  const { data: profile, error: profile_error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user_id as string);
  const { data: personal_info, error: personal_info_error } = await supabase
    .from("personal_info")
    .select("*")
    .eq("id", user_id as string);

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
    personal_info: personal_info,
  };
}
async function getOtherProfile(
  id: string,
  supabase: SupabaseClient<any, "public", any>
) {
  const { data: profile, error: profile_error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id as string);
  return profile;
}
async function getUserPosts(
  supabase: SupabaseClient<any, "public", any>,
  user_id: string | undefined
) {
  if (!user_id) return null;
  const { data: posts, error: error } = await supabase
    .from("posts")
    .select(
      "*,profiles(*),post:share_source(*,profiles(avatar_url,id,username))"
    )
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });
  const posts_data = await Promise.all(
    (posts || []).map(async (post) => {
      let { data: like_related_to_post, error: like_related_to_post_error } =
        await supabase
          .from("likes")
          .select()
          .eq("user_id", user_id)
          .eq("post_id", post.id);
      //for shared post
      if (post.post) {
        const test = { ...post.post };
        const newPost = Object.fromEntries(
          Object.entries(post).filter((key) => key[0] !== "post")
        );
        const { data: sub_post, error: sub_error } = await supabase
          .from("likes")
          .select()
          .eq("user_id", user_id) // @ts-ignore
          .eq("post_id", post.post.id);
        return {
          ...newPost,
          post: {
            ...test,
            is_liked: sub_post?.length === 1,
          },
          is_liked: like_related_to_post?.length === 1,
        };
      } else {
        return {
          ...post,
          is_liked: like_related_to_post?.length === 1,
        };
      }
    })
  );
  return posts_data;
}
async function getMyProfileData(
  supabase: SupabaseClient<any, "public", any>,
  user_id: string | undefined
) {
  const { data: profile, error: profile_error } = await supabase
    .from("profiles")
    .select("avatar_url,username")
    .eq("id", user_id as string);
  return profile;
}

export default Page;
