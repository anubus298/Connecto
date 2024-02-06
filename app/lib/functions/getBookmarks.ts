import { Tables } from "@/utils/supabase/supabase";
import { Profile } from "@/app/home/home_main";
import { Database } from "@/utils/supabase/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
type BookmarkServer = Tables<"bookmarks"> & {
  post_id: NonNullable<Tables<"posts">> & {
    user_id: Profile;
  };
};
export async function getBookmarks(
  supabase: SupabaseClient<Database, "public", Database["public"]>,
  from: number,
  to: number,
  user_id?: string
) {
  if (user_id) {
    const { data } = await supabase
      .from("bookmarks")
      .select("*,post_id(*,user_id(avatar_url,username,id))")
      .order("created_at", { ascending: false })
      .eq("user_id", user_id)
      .range(from, to)
      .returns<BookmarkServer[]>();
    return data;
  } else {
    return null;
  }
}
