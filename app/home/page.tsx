import { Database } from "@/utils/supabase/supabase";
import {
  createServerComponentClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { addPostAction } from "../lib/functions/user/post/addPost";
import Left_home_panel from "./components/left_home_panel";
import Right_home_panel from "./components/right_home_panel";
import Third_grid from "./components/third_grid";
import Home_main from "./home_main";
import { getFriends } from "./messages/page";

async function Page() {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookiesStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const suggested_friends = await getSuggestedFriends(
    supabase,
    user?.id as string
  );
  const posts = await getPosts(supabase, user?.id);
  const profile = await getMyProfile(supabase, user?.id);
  if (!profile?.username) {
    redirect("/constructors/newAccount");
  }
  const friends = await getFriends(supabase, user?.id);
  return (
    <div className="grid grid-cols-12 gap-2">
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

export async function getPosts(
  supabase: SupabaseClient<any, "public", any>,
  user_id?: string,
  target?: string,
  order?: { column: string; status: boolean },
  limit?: number
) {
  if (target) {
    let { data: posts, error: posts_error } = await supabase
      .from("posts")
      .select(
        "*,profiles!posts_user_id_fkey(avatar_url,id,username),post:share_source(*,profiles!posts_user_id_fkey(avatar_url,id,username))"
      )
      .eq("user_id", target)
      .order(order?.column ?? "created_at", { ascending: order?.status })
      .limit(limit ?? 15);

    const posts_data = await Promise.all(
      (posts || []).map(async (post) => {
        let { data: like_related_to_post, error: like_related_to_post_error } =
          await supabase
            .from("likes")
            .select()
            .eq("user_id", user_id)
            .eq("post_id", post.id)
            .limit(1);
        let { data: save_related_to_post, error: save_related_to_post_error } =
          await supabase
            .from("bookmarks")
            .select()
            .eq("user_id", user_id)
            .eq("post_id", post.id)
            .limit(1);
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
            is_saved: save_related_to_post?.length === 1,
          };
        } else {
          return {
            ...post,
            is_liked: like_related_to_post?.length === 1,
            is_saved: save_related_to_post?.length === 1,
          };
        }
      })
    );
    return posts_data;
  } else {
    let { data: posts, error: posts_error } = await supabase
      .from("posts")
      .select(
        "*,profiles!posts_user_id_fkey(avatar_url,id,username),post:share_source(*,profiles!posts_user_id_fkey(avatar_url,id,username))"
      )
      .order(order?.column ?? "created_at", { ascending: false })
      .limit(limit ?? 7);

    const posts_data = await Promise.all(
      (posts || []).map(async (post) => {
        let { data: like_related_to_post, error: like_related_to_post_error } =
          await supabase
            .from("likes")
            .select()
            .eq("user_id", user_id)
            .eq("post_id", post.id)
            .limit(1);
        let { data: save_related_to_post, error: save_related_to_post_error } =
          await supabase
            .from("bookmarks")
            .select()
            .eq("user_id", user_id)
            .eq("post_id", post.id)
            .limit(1);
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
            is_saved: save_related_to_post?.length === 1,
          };
        } else {
          return {
            ...post,
            is_liked: like_related_to_post?.length === 1,
            is_saved: save_related_to_post?.length === 1,
          };
        }
      })
    );
    return posts_data;
  }
}
export async function getMyProfile(
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
