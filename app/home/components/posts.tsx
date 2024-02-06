"use client";
import { Tables } from "@/utils/supabase/supabase";
import { ConfigProvider } from "antd";
import { Post as PostType } from "../home_main";
import Post from "./post";

interface Props {
  posts: PostType[];
  user_id: string;
  my_profile: NonNullable<Tables<"profiles">>;
  show_small?: boolean;
}
function Posts({ posts, user_id, my_profile, show_small = false }: Props) {
  return (
    <ConfigProvider
      theme={{
        components: { Avatar: { containerSize: 30 } },
      }}
    >
      <div className="flex flex-col gap-2">
        {posts?.map((post, index) => {
          return (
            <Post
              show_small={show_small}
              my_profile={my_profile}
              post={post}
              key={String(index + 6548 + 56432 + 1) + post.id}
              user_id={user_id}
            />
          );
        })}
      </div>
    </ConfigProvider>
  );
}

export default Posts;
