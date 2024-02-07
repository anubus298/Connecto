import { Profile } from "@/app/home/home_main";
import { Database, Tables } from "@/utils/supabase/supabase";
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
export async function getComments(
  supabase: SupabaseClient<Database, "public", Database["public"]>,
  post_id: string,
  order?: { key?: string; status?: boolean },
  from?: number,
  to?: number,
  my_id?: string
) {
  if (my_id) {
    const { data: comments, error } = await supabase
      .from("comments")
      .select("*,profiles(avatar_url,username,id)")
      .eq("post_id", post_id)
      .order(order?.key ?? "created_at", { ascending: order?.status ?? false })
      .range(from ?? 0, to ?? 9);
    const comments_data = await Promise.all(
      (comments || []).map(async (comment) => {
        try {
          let {
            data: like_related_to_post,
            error: like_related_to_post_error,
          } = await supabase
            .from("comments_like")
            .select()
            .eq("user_id", my_id)
            .eq("comment_id", comment.comment_id);
          return {
            ...comment,
            is_liked: like_related_to_post?.length === 1,
            is_self: comment.user_id === my_id,
          };
        } catch (error) {
          return {
            ...comment,
            is_liked: false,
            is_self: comment.user_id === my_id,
          };
        }
      })
    );
    return comments_data;
  } else return null;
}
