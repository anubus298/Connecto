"use client";

import incrementLikeAction from "@/app/lib/functions/user/incrementlike";
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
import AddCommentAction from "@/app/lib/functions/user/post/addComment";

interface Props {
  post: Database["public"]["Tables"]["posts"]["Row"] & {
    profiles: Database["public"]["Tables"]["profiles"]["Row"];
    is_liked: boolean;
  };
  is_self: boolean;
}
function Post({ post, is_self }: Props) {
  const date = new Date(post.created_at);
  const AddCommentActionBind = AddCommentAction.bind(null, post.id);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postContent, setPostContent] = useState<string | undefined>(
    post.content?.slice(0, 150)
  );
  const [isPostContentCut, setisPostContentCut] = useState(true);

  const [isModalPostContentCut, setisModalPostContentCut] = useState(true);
  const [ModalpostContent, setModalPostContent] = useState<string | undefined>(
    post.content?.slice(0, 50)
  );
  const [formattedDate, setFormattedDate] = useState("");
  const [comments, setComments] = useState<
    (Database["public"]["Tables"]["comments"]["Row"] & {
      profiles: Database["public"]["Tables"]["profiles"]["Row"];
    })[]
  >([]);

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
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
  useEffect(() => {
    function getComments() {
      fetch(`/api/post/getComments?id=${post.id}`, { method: "GET" })
        .then((res) => res.json())
        .then((data) => setComments(data.data));
    }
    if (isPostModalOpen) {
      getComments();
    }
  }, [isPostModalOpen]);
  return (
    <div className="flex flex-col gap-6 p-3 bg-white">
      <Modal
        title="Delete post"
        centered
        open={isDeleteModalOpen}
        onOk={async () => {
          await deletePostAction(post.id);
          setIsDeleteModalOpen(false);
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
      >
        <p>
          Are you sure you want to delete this post? This action cannot be
          undone
        </p>
      </Modal>
      <Modal
        width={"60vw"}
        open={isPostModalOpen}
        centered
        onCancel={() => setIsPostModalOpen(false)}
        closeIcon={false}
        footer={null}
      >
        <div className="grid grid-cols-12 min-h-[400px] gap-2">
          <div className="col-span-6">imgs</div>
          <div className="grid content-start grid-cols-12 col-span-6 gap-x-[15px] gap-y-6">
            {/* modal post */}
            {post.profiles.avatar_url && (
              <>
                <Avatar
                  className="col-span-1 place-self-center"
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

                <div className="flex flex-col col-span-10">
                  <p className="text-sm font-semibold">
                    {post.profiles.username}
                  </p>
                  <p className="max-h-[100px] overflow-y-auto">
                    {ModalpostContent}
                    {(post.content?.length as number) > 50 && (
                      <span
                        className="text-sm cursor-pointer text-blue-950"
                        onClick={() => {
                          if (isModalPostContentCut) {
                            setModalPostContent(post.content as string);
                            setisModalPostContentCut(false);
                          } else {
                            setModalPostContent(
                              post.content?.slice(0, 50) as string
                            );
                            setisModalPostContentCut(true);
                          }
                        }}
                      >
                        {isModalPostContentCut ? "...more" : "...less"}
                      </span>
                    )}
                  </p>
                </div>
                <div className="col-span-1 ">
                  <Dropdown
                    menu={{ items, onClick: handleDropDownClick }}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <button>
                      <FontAwesomeIcon icon={faEllipsisV} className="text-lg" />
                    </button>
                  </Dropdown>
                </div>
                <div className="h-[1px] col-span-12 bg-dark"></div>
              </>
            )}
            {/* comments */}
            {comments &&
              comments?.map((comment, index) => {
                return (
                  <>
                    {comment.profiles.avatar_url && (
                      <Avatar
                        className="col-span-1 place-self-center"
                        shape="square"
                        key={comment.comment_id * 100 + index + 1}
                        src={
                          <Image
                            src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${comment.profiles.avatar_url}`}
                            height={30}
                            width={30}
                            alt={comment.profiles.username + " avatar"}
                          />
                        }
                      />
                    )}

                    <div className="flex flex-col col-span-11">
                      <p className="text-sm font-semibold">
                        {comment.profiles.username}
                      </p>
                      <p className="" key={comment.comment_id * 100 + index}>
                        {comment.content}
                      </p>
                    </div>
                  </>
                );
              })}
          </div>
          <div className="grid content-end grid-cols-12 col-span-12 gap-x-2 gap-y-6">
            <div className="self-end col-span-12">
              <form action={AddCommentActionBind}>
                <div className="flex ">
                  <input
                    name="content"
                    type={"text"}
                    placeholder="Add a Comment"
                    className="w-full px-4 py-4 bg-gray-200 focus-visible:outline-none"
                  />
                  <button
                    type="submit"
                    className="p-2 px-10 text-white rounded-sm bg-primary"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
      {/*real post*/}
      <div className="flex items-center justify-between">
        <div className="">
          {post.profiles.avatar_url && (
            <div className="flex items-center gap-2">
              <Avatar
                className="col-span-1"
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
              <div className="flex flex-col">
                <p className="text-sm font-semibold">
                  {post.profiles.username}
                </p>
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
          <p className="text-sm">{post.comments_count} Comments</p>
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
