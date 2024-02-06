import { Tables } from "@/utils/supabase/supabase";
import Left_home_panel from "../../components/left_home_panel";
import Post from "../../components/post";
import { Post as PostType } from "../../home_main";

interface Props {
  post: PostType[];
  my_profile: Tables<"profiles">;
  user_id: string;
}
function Main_post({ post, my_profile, user_id }: Props) {
  return (
    <div className="grid grid-cols-12 gap-4 *:rounded-md">
      <Left_home_panel />
      <div className="col-start-1 col-end-13 p-3 bg-white md:col-start-3 md:col-end-11">
        <Post
          post={post[0]}
          user_id={user_id}
          my_profile={my_profile}
          is_in_page={true}
        />
      </div>
    </div>
  );
}

export default Main_post;
