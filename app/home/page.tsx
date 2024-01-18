import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { postAction } from "../lib/functions/user/addPost";
import Left_home_panel from "./components/left_home_panel";
import Right_home_panel from "./components/right_home_panel";
import Third_grid from "./components/third_grid";
import Home_main from "./home_main";
export const revalidate = 0;
async function Page() {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookiesStore });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile, error: profile_error } = await supabase
    .from("profiles")
    .select("avatar_url,username")
    .eq("id", user?.id as string);
  let { data: posts, error: posts_error } = await supabase
    .from("posts")
    .select("*,profiles(*)");
  const posts_data = await Promise.all(
    (posts || []).map(async (post) => {
      try {
        let { data: like_related_to_post, error: like_related_to_post_error } =
          await supabase
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
  return (
    <div className="grid grid-cols-12 gap-1">
      <Left_home_panel />
      <Home_main
        posts={posts_data}
        user_id={user?.id}
        profile={profile?.[0]}
        postAction={postAction}
      />
      <Third_grid />
      <Right_home_panel />
    </div>
  );
}

export default Page;
