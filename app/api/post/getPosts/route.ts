import { getBookmarks } from "@/app/lib/functions/getBookmarks";
import {
  SupabaseClient,
  createRouteHandlerClient,
} from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Database } from "@/utils/supabase/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get("from") as unknown as number;
  const to = searchParams.get("to") as unknown as number;
  const target = searchParams.get("target") as unknown as string | undefined;
  const cookieStore = cookies();
  try {
    if (from && to) {
      if (to - from > 15) {
        return NextResponse.json({ error: "15 max" });
      }
    }
    const supabase = createRouteHandlerClient<Database>({
      cookies: () => cookieStore,
    });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const data = await getPostsFromTo(supabase, from, to, user?.id, target);

    return NextResponse.json({ data: data });
  } catch (error) {}
}

async function getPostsFromTo(
  supabase: SupabaseClient<any, "public", any>,
  from: number,
  to: number,
  user_id?: string,
  target?: string
) {
  if (target) {
    let { data: posts, error: posts_error } = await supabase
      .from("posts")
      .select(
        "*,profiles!posts_user_id_fkey(avatar_url,id,username),post:share_source(*,profiles!posts_user_id_fkey(avatar_url,id,username))"
      )
      .order("created_at", { ascending: false })
      .eq("user_id", target)
      .range(from, to);

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

      .range(from, to);

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
