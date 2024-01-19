import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Database } from "@/utils/supabase/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id") as string;
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: comments, error } = await supabase
    .from("comments")
    .select("*,profiles(*)")
    .eq("post_id", id);
  const comments_data = await Promise.all(
    (comments || []).map(async (comment) => {
      try {
        let { data: like_related_to_post, error: like_related_to_post_error } =
          await supabase
            .from("comments_like")
            .select()
            .eq("user_id", user!.id)
            .eq("comment_id", comment.comment_id);
        return {
          ...comment,
          is_liked: like_related_to_post?.length === 1,
          is_self: comment.user_id === user?.id,
        };
      } catch (error) {
        return {
          ...comment,
          is_liked: false,
          is_self: comment.user_id === user?.id,
        };
      }
    })
  );

  if (error) return NextResponse.json({ error: error });
  return NextResponse.json({ data: comments_data });
}
