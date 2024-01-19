"use client";

import incrementLikeAction from "@/app/lib/functions/user/post/incrementlike";
import { Avatar, Dropdown, MenuProps, Modal } from "antd";
import decrementLikeAction from "@/app/lib/functions/user/post/decrementlike";
import { Database } from "@/utils/supabase/supabase";

import {
  faHeart,
  faComment,
  faShareFromSquare,
} from "@fortawesome/free-regular-svg-icons";
import {
  faFlag,
  faHeart as faHeartSolid,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";
import deletePostAction from "@/app/lib/functions/user/post/deletePost";
import Post_modal from "./post_modal";
import Link from "next/link";

interface Props {
  post: Database["public"]["Tables"]["posts"]["Row"] & {
    profiles: Database["public"]["Tables"]["profiles"]["Row"];
    is_liked: boolean;
    is_self: boolean;
  };
  is_self: boolean;
}
function Post({ post, is_self }: Props) {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [is_deleting_post_pending, setis_deleting_post_pending] =
    useState(false);
  const date = new Date(post.created_at);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postContent, setPostContent] = useState<string | undefined>(
    post.content?.slice(0, 150)
  );
  const [isPostContentCut, setisPostContentCut] = useState(true);
  const [formattedDate, setFormattedDate] = useState("");
  const handleDropDownClick: MenuProps["onClick"] = async ({ key }) => {
    if (key == "2") {
      setIsDeleteModalOpen(true);
    }
  };
  let items: MenuProps["items"];
  if (is_self) {
    items = [
      {
        key: "1",
        label: (
          <div className="flex items-center gap-2 text-dark">
            <FontAwesomeIcon icon={faPen} />
            <p>Edit</p>
          </div>
        ),
      },
      {
        key: "2",
        label: (
          <div className="flex items-center gap-2 text-dark">
            <FontAwesomeIcon icon={faTrash} />
            <p>Delete</p>
          </div>
        ),
      },
    ];
  } else {
    items = [
      {
        key: "3",
        label: (
          <div className="flex items-center gap-2 text-dark">
            <FontAwesomeIcon icon={faFlag} />
            <p>Report</p>
          </div>
        ),
      },
    ];
  }
  const [likes_count, setlikes_count] = useState<number>(post.likes_count ?? 0);
  const [comments_count, setcomments_count] = useState<number>(
    post.comments_count ?? 0
  );
  const [is_liked, setis_liked] = useState(post.is_liked);
  async function handle_like_click() {
    if (is_liked) {
      setlikes_count(likes_count - 1);
      setis_liked(false);
      await decrementLikeAction(post.id);
    } else {
      setlikes_count(likes_count + 1);
      setis_liked(true);
      await incrementLikeAction(post.id);
    }
  }

  useEffect(() => {
    setFormattedDate(
      new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      }).format(date)
    );
  }, []);
  return (
    <div className="flex flex-col gap-6 p-3 bg-white">
      {/* delete post modal */}
      <Modal
        title="Delete post"
        centered
        open={isDeleteModalOpen}
        okButtonProps={{
          loading: is_deleting_post_pending,
        }}
        onOk={async () => {
          setis_deleting_post_pending(true);
          await deletePostAction(post.id);
          setIsDeleteModalOpen(false);
          setis_deleting_post_pending(false);
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
      >
        <p>
          Are you sure you want to delete this post? This action cannot be
          undone
        </p>
      </Modal>
      {/* post modal */}
      <Post_modal
        setcomments_count={setcomments_count}
        comments_count={comments_count}
        post={post}
        dropDownItems={items}
        handleDropDownClick={handleDropDownClick}
        isPostModalOpen={isPostModalOpen}
        setIsPostModalOpen={setIsPostModalOpen}
      />
      {/*real post*/}
      <div className="flex items-center justify-between">
        <div className="">
          {post.profiles.avatar_url && (
            <div className="flex items-center gap-2">
              <Link
                className="col-span-1"
                href={
                  is_self ? "/home/profile" : `/home/profile?id=${post.user_id}`
                }
              >
                <Avatar
                  className=" "
                  shape="square"
                  src={
                    <Image
                      src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${post.profiles.avatar_url}`}
                      height={30}
                      width={30}
                      alt={post.profiles.username + " avatar"}
                    />
                  }
                />
              </Link>
              <div className="flex flex-col">
                <Link
                  href={
                    is_self
                      ? "/home/profile"
                      : `/home/profile?id=${post.user_id}`
                  }
                  className="text-sm font-semibold"
                >
                  {post.profiles.username}
                </Link>
                <p className="text-xs text-gray-400">{formattedDate}</p>
              </div>
            </div>
          )}
        </div>
        <Dropdown
          menu={{ items, onClick: handleDropDownClick }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <button>
            <FontAwesomeIcon icon={faEllipsisV} />
          </button>
        </Dropdown>
      </div>
      <p>
        {postContent}
        {(post.content?.length as number) > 150 && (
          <span
            className="text-sm cursor-pointer text-blue-950"
            onClick={() => {
              if (isPostContentCut) {
                setPostContent(post.content as string);
                setisPostContentCut(false);
              } else {
                setPostContent(post.content?.slice(0, 150) as string);
                setisPostContentCut(true);
              }
            }}
          >
            {isPostContentCut ? "...more" : "...less"}
          </span>
        )}
      </p>

      <div className="flex w-full gap-2">
        <button
          onClick={handle_like_click}
          className="flex items-center gap-2 p-2 bg-gray-100 rounded-md"
        >
          <FontAwesomeIcon
            icon={is_liked ? faHeartSolid : faHeart}
            className={is_liked ? "text-primary" : ""}
          />
          <p className="text-sm">{likes_count} likes</p>
        </button>
        <button
          onClick={() => setIsPostModalOpen(true)}
          className="flex items-center gap-2 p-2 bg-gray-100 rounded-md"
        >
          <FontAwesomeIcon icon={faComment} />
          <p className="text-sm">{comments_count} Comments</p>
        </button>
        <button className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
          <FontAwesomeIcon icon={faShareFromSquare} />
          <p className="text-sm">{post.shares_count} Shares</p>
        </button>
      </div>
    </div>
  );
}

export default Post;
