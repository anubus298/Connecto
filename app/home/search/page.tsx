import { Database } from "@/utils/supabase/supabase";
import {
  SupabaseClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Main_search from "./components/main_search";
import { searchQuerySchema } from "@/app/lib/zod/schemas";
async function Page({ searchParams }: { searchParams: { query?: string } }) {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookiesStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const search_posts = await get_search_posts(
    supabase,
    user!.id,
    searchParams.query
  );
  const search_profiles = await get_search_profiles(
    supabase,
    searchParams.query
  );
  const my_profile = await getMyProfile(supabase, user?.id);
  return (
    <Main_search
      //@ts-ignore
      search_posts={search_posts}
      //@ts-ignore
      search_profiles={search_profiles}
      //@ts-ignore
      my_profile={my_profile}
      query={searchParams.query}
    />
  );
}

async function get_search_profiles(
  supabase: SupabaseClient<Database, "public", Database["public"]>,
  query?: string
) {
  try {
    searchQuerySchema.parse(query);
  } catch (error) {
    return null;
  }
  if (query) {
    const { data: profiles } = await supabase.rpc("get_search_profiles", {
      search_text: query,
    });
    return profiles;
  } else return null;
}
async function get_search_posts(
  supabase: SupabaseClient<any, "public", any>,
  user_id: string,
  query?: string
) {
  try {
    searchQuerySchema.parse(query);
  } catch (error) {
    return null;
  }
  if (query) {
    let { data: posts, error: posts_error } = await supabase
      .from("posts")
      .select(
        "*,profiles!posts_user_id_fkey(avatar_url,id,username),post:share_source(*,profiles!posts_user_id_fkey(avatar_url,id,username))"
      )
      .like("content", `%${query}%`)
      .limit(15);
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
  } else return null;
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
export default Page;
