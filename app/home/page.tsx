import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import incrementLikeAction from "../lib/functions/user/incrementlike";
import { postAction } from "../lib/functions/user/post";
import Left_home_panel from "./components/left_home_panel";
import Right_home_panel from "./components/right_home_panel";
import Third_grid from "./components/third_grid";
import Home_main from "./home_main";
export const revalidate = 0;
async function Page() {
  const cookiesStore = cookies();
  const supabase = createClient(cookiesStore);
  await supabase.auth.getSession();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_url,username")
    .eq("id", user?.id as string);
  let { data: posts, error: posts_error } = await supabase
    .from("posts")
    .select("*,profiles(*)");
  return (
    <div className="grid grid-cols-12 gap-1">
      <Left_home_panel />
      <Home_main
        posts={posts}
        incrementLikeAction={incrementLikeAction}
        user={user}
        error={posts_error}
        profile={profile?.[0]}
        postAction={postAction}
      />
      <Third_grid />
      <Right_home_panel />
    </div>
  );
}

export default Page;
