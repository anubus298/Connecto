import { SupabaseClient } from "@supabase/supabase-js";
export async function getPost(
  supabase: SupabaseClient<any, "public", any>,
  post_id: string,
  my_id?: string
) {
  let { data: posts, error: posts_error } = await supabase
    .from("posts")
    .select(
      "*,profiles!posts_user_id_fkey(avatar_url,id,username),post:share_source(*,profiles!posts_user_id_fkey(avatar_url,id,username))"
    )
    .eq("id", post_id)
    .limit(1);

  const posts_data = await Promise.all(
    (posts || []).map(async (post) => {
      let { data: like_related_to_post, error: like_related_to_post_error } =
        await supabase
          .from("likes")
          .select()
          .eq("user_id", my_id)
          .eq("post_id", post.id)
          .limit(1);
      let { data: save_related_to_post, error: save_related_to_post_error } =
        await supabase
          .from("bookmarks")
          .select()
          .eq("user_id", my_id)
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
          .eq("user_id", my_id)
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
