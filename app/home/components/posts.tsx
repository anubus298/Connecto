"use client";
import { Tables } from "@/utils/supabase/supabase";
import InfiniteScroll from "react-infinite-scroll-component";

import { Button, ConfigProvider } from "antd";
import { Post as PostType } from "../home_main";
import Post from "./post";

import useFetchPage from "@/app/lib/hooks/useFetchPage";
import { useState } from "react";

interface Props {
  posts: PostType[];
  user_id: string;
  my_profile: NonNullable<Tables<"profiles">>;
  show_small?: boolean;
  target?: string;
}
function Posts({
  posts,
  user_id,
  my_profile,
  show_small = false,
  target,
}: Props) {
  let params: {
    [key: string]: string | number | boolean;
  } = {};
  if (target) {
    params.target = target;
  } else {
    params.dd = "";
  }
  const [from, setFrom] = useState(0);
  const { loading, list, hasMore } = useFetchPage<PostType>(
    "/api/post/getPosts",
    params,
    posts,
    from,
    from + 7
  );

  return (
    <ConfigProvider
      theme={{
        components: { Avatar: { containerSize: 30 } },
      }}
    >
      <div className="flex flex-col gap-2">
        <InfiniteScroll
          style={{
            rowGap: "0.5rem",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
          scrollThreshold={0.6}
          loader={
            <div className="flex justify-center w-full">
              <Button type="text" loading className="font-medium">
                Loading feed
              </Button>
            </div>
          }
          hasMore={hasMore}
          dataLength={list.length}
          next={() => setFrom((prev) => prev + 7)}
        >
          {list?.map((post) => {
            return (
              <Post
                show_small={show_small}
                my_profile={my_profile}
                post={post}
                key={post.id + post.user_id}
                user_id={user_id}
              />
            );
          })}
        </InfiniteScroll>
      </div>
    </ConfigProvider>
  );
}

export default Posts;
