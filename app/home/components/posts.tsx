import { Tables } from "@/utils/supabase/supabase";
import { ConfigProvider } from "antd";
import { Profile, Post as PostType } from "../home_main";
import Post from "./post";

interface Props {
  posts: PostType[];
  user_id: string;
  my_profile: NonNullable<Tables<"profiles">>;
}
function Posts({ posts, user_id, my_profile }: Props) {
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
              my_profile={my_profile}
              post={post}
              key={index + post.id + 6548 + 56432 + 1}
              user_id={user_id}
            />
          );
        })}
      </div>
    </ConfigProvider>
  );
}

export default Posts;
