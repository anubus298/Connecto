import { Database } from "@/utils/supabase/supabase";
import Post from "./post";

interface Props {
  posts: (Database["public"]["Tables"]["posts"]["Row"] & {
    profiles: Database["public"]["Tables"]["profiles"]["Row"];
    is_liked: boolean;
    is_self: boolean;
  })[];
  user_id: string | null;
}
function Posts({ posts, user_id }: Props) {
  return (
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
  );
}

export default Posts;
