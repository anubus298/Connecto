import { Database, Tables } from "@/utils/supabase/supabase";
import { Suspense } from "react";
import Posts from "./components/posts";
import Post_something from "./components/post_something";
import Suspense_posts from "./components/suspense/suspense_posts";
import Suspense_postSomething from "./components/suspense/suspense_postsomething";
export type Post = Database["public"]["Tables"]["posts"]["Row"] & {
  profiles: {
    avatar_url: string | null;
    username: string;
    id: number;
  };
  post?: Post;
  is_liked: boolean;
  is_self: boolean;
};
export type Profile = {
  avatar_url: string;
  id?: string;
  username: string;
};
interface Props {
  profile: NonNullable<Tables<"profiles">>;
  user_id: string;
  posts: Post[];
  suggested_friends: Profile[];
}
function Home_main({ profile, posts, user_id }: Props) {
  return (
    <div className="flex flex-col justify-center col-span-12 mx-2 sm:col-span-8 md:col-span-6 sm:mx-0">
      <Suspense fallback={<Suspense_postSomething />}>
        <Post_something avatar={profile?.avatar_url} />
      </Suspense>
      <Suspense fallback={<Suspense_posts />}>
        <Posts posts={posts} user_id={user_id} my_profile={profile} />
      </Suspense>
    </div>
  );
}

export default Home_main;
