"use client";

import { Database } from "@/utils/supabase/supabase";
import Posts from "./components/posts";
import Post_something from "./components/post_something";
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

interface Props {
  profile?: {
    avatar_url: string | null;
    username: string | null;
  };
  user_id: string | null;
  postAction: any;
  posts: Post[];
}
function Home_main({ profile, postAction, posts, user_id }: Props) {
  return (
    <div className="flex flex-col justify-center col-span-12 mx-2 sm:col-span-8 md:col-span-6 sm:mx-0">
      <Post_something avatar={profile?.avatar_url} postAction={postAction} />
      <Posts posts={posts} user_id={user_id} />
    </div>
  );
}

export default Home_main;
