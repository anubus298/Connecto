"use client";

import { Database } from "@/utils/supabase/supabase";
import Posts from "./components/posts";
import Post_something from "./components/post_something";
interface Props {
  profile?: {
    avatar_url: string | null;
    username: string | null;
  };
  user_id: string | undefined;
  postAction: any;
  posts?: (Database["public"]["Tables"]["posts"]["Row"] & {
    profiles: Database["public"]["Tables"]["profiles"]["Row"] & {
      is_liked: boolean;
    };
  })[];
}
function Home_main({ profile, postAction, posts, user_id }: Props) {
  return (
    <div className="flex flex-col justify-center col-span-6">
      <Post_something avatar={profile?.avatar_url} postAction={postAction} />
      <Posts posts={posts} user_id={user_id} />
    </div>
  );
}

export default Home_main;
