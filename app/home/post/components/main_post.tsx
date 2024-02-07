import { Tables } from "@/utils/supabase/supabase";
import Left_home_panel from "../../components/left_home_panel";
import Post from "../../components/post";
import { Post as PostType, Profile } from "../../home_main";
import Comments_section from "./comments_section";
import { Suspense } from "react";
import Suspense_post from "../../components/suspense/suspense_post";

interface Props {
  post: PostType[];
  my_profile: Tables<"profiles">;
  user_id: string;
  comments: (Tables<"comments"> & {
    profiles: Profile;
    is_liked: boolean;
    is_self: boolean;
  })[];
}
function Main_post({ post, my_profile, user_id, comments }: Props) {
  return (
    <div className="grid grid-cols-12 gap-4 *:rounded-md">
      <Left_home_panel />
      <div className="col-start-1 col-end-13 p-3 bg-white md:col-start-3 md:col-end-12 lg:col-start-3 lg:col-end-11">
        <Suspense fallback={<Suspense_post />}>
          <Post
            post={post[0]}
            user_id={user_id}
            my_profile={my_profile}
            is_in_page={true}
          />
        </Suspense>
        <Comments_section comments={comments} post_id={post[0].id} />
      </div>
    </div>
  );
}

export default Main_post;
