"use client";
import { Post as PostType, Profile } from "../home_main";

import { Tables } from "@/utils/supabase/supabase";
import { ConfigProvider, Modal } from "antd";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
//prettier-ignore
//@ts-ignore
import { useMediaQuery } from "react-responsive";
import Post from "./post";
import Comments_section, { Comment } from "../post/components/comments_section";

interface Props {
  post: PostType;
  my_profile: Tables<"profiles">;
  user_id: string;
  comments: (Tables<"comments"> & {
    profiles: Profile;
    is_liked: boolean;
    is_self: boolean;
  })[];
  setIsPostModalOpen: Dispatch<SetStateAction<boolean>>;
  isPostModalOpen: boolean;
  setcomments_count: Dispatch<SetStateAction<number>>;
}
function Post_modal({
  post,
  isPostModalOpen,
  setIsPostModalOpen,
  setcomments_count,
  comments,
  user_id,
  my_profile,
}: Props) {
  const isMediumScreen = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <ConfigProvider
      theme={{
        token: {
          padding: isMediumScreen ? 2 : 16,
          paddingLG: isMediumScreen ? 4 : 24,
        },
      }}
    >
      <Modal
        destroyOnClose
        width={isMediumScreen ? "100vw" : "50vw"}
        open={isPostModalOpen}
        centered
        onCancel={() => setIsPostModalOpen(false)}
        footer={null}
      >
        <Post
          post={post}
          user_id={user_id}
          my_profile={my_profile}
          is_in_page={true}
        />
        <Comments_section
          is_modal={true}
          comments={[]}
          post_id={post.id}
          setcomments_count={setcomments_count}
        />
      </Modal>
    </ConfigProvider>
  );
}

export default Post_modal;
