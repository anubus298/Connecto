"use client";

import { Database } from "@/utils/supabase/supabase";
import Post from "./post";

interface Props {
  posts?: (Database["public"]["Tables"]["posts"]["Row"] & {
    profiles: Database["public"]["Tables"]["profiles"]["Row"];
  })[];
  incrementLikeAction: any;
}
function Posts({ posts, incrementLikeAction }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {posts?.map((post, index) => {
        return (
          <Post
            post={post}
            key={index + post.id}
            incrementlike={incrementLikeAction}
          />
        );
      })}
    </div>
  );
}

export default Posts;
