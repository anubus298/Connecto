import { Database } from "@/utils/supabase/supabase";
import {
  createServerComponentClient,
  SupabaseClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { addPostAction } from "../lib/functions/user/post/addPost";
import Left_home_panel from "./components/left_home_panel";
import Right_home_panel from "./components/right_home_panel";
import Third_grid from "./components/third_grid";
import Home_main from "./home_main";
import { getFriends } from "./messages/page";

async function Page() {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookiesStore });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const suggested_friends = await getSuggestedFriends(
    supabase,
    user?.id as string
  );
  const posts = await getPosts(supabase, user?.id);
  const profile = await getMyProfile(supabase, user?.id);
  const friends = await getFriends(supabase, user?.id);
  return (
    <div className="grid grid-cols-12 gap-1">
      <Left_home_panel />
      <Home_main
        posts={posts}
        user_id={user!.id}
        //@ts-ignore
        profile={profile}
        postAction={addPostAction}
      />
      {/*@ts-ignore*/}
      <Third_grid friends={suggested_friends} />
      <Right_home_panel
        //@ts-ignore
        friends={friends?.map((friend) => {
          return { ...friend, lastOnline: null };
        })}
      />
    </div>
  );
}

async function getPosts(
  supabase: SupabaseClient<any, "public", any>,
  user_id?: string
) {
  let { data: posts, error: posts_error } = await supabase
    .from("posts")
    .select(
      "*,profiles(avatar_url,id,username),post:share_source(*,profiles(avatar_url,id,username))"
    );
  const posts_data = await Promise.all(
    (posts || []).map(async (post) => {
      let { data: like_related_to_post, error: like_related_to_post_error } =
        await supabase
          .from("likes")
          .select()
          .eq("user_id", user_id)
          .eq("post_id", post.id)
          .limit(15);
      //for shared post
      if (post.post) {
        const test = { ...post.post };
        const newPost = Object.fromEntries(
          Object.entries(post).filter((key) => key[0] !== "post")
        );
        const { data: sub_post, error: sub_error } = await supabase
          .from("likes")
          .select()
          .eq("user_id", user_id)
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
async function getMyProfile(
  supabase: SupabaseClient<any, "public", any>,
  user_id?: string
) {
  const { data: profile, error: profile_error } = await supabase
    .from("profiles")
    .select("avatar_url,username")
    .eq("id", user_id as string)
    .limit(1)
    .single();
  return profile;
}
async function getSuggestedFriends(
  supabase: SupabaseClient<Database, "public", Database["public"]>,
  user_id: string
) {
  const { data: suggested_friends, error: suggested_friends_error } =
    await supabase
      .rpc("get_non_friends", { user_id: user_id })
      .select("avatar_url,id,username");
  return suggested_friends;
}
export default Page;
