"use client";

import { Database } from "@/utils/supabase/supabase";
import Posts from "./components/posts";
import Post_something from "./components/post_something";
interface Props {
  profile?: {
    avatar_url: string | null;
    username: string | null;
  };
  incrementLikeAction: any;
  postAction: any;
  posts?: (Database["public"]["Tables"]["posts"]["Row"] & {
    profiles: Database["public"]["Tables"]["profiles"]["Row"];
  })[];
}
function Home_main({ profile, postAction, posts, incrementLikeAction }: Props) {
  return (
    <div className="flex flex-col justify-center col-span-6">
      <Post_something avatar={profile?.avatar_url} postAction={postAction} />
      <Posts posts={posts} incrementLikeAction={incrementLikeAction} />
    </div>
  );
}

export default Home_main;
