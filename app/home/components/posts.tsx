import { Database } from "@/utils/supabase/supabase";
import { ConfigProvider } from "antd";
import { Post as PostType } from "../home_main";
import Post from "./post";

interface Props {
  posts: PostType[];
  user_id: string | null;
}
function Posts({ posts, user_id }: Props) {
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
              post={post}
              key={index + post.id}
              is_self={post.user_id === user_id}
            />
          );
        })}
      </div>
    </ConfigProvider>
  );
}

export default Posts;
