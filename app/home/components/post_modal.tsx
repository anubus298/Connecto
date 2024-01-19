"use client";

import { faEllipsisV, faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddCommentAction from "@/app/lib/functions/user/post/addComment";
import { Database } from "@/utils/supabase/supabase";
import { Avatar, Button, Dropdown, MenuProps, Modal } from "antd";
import Image from "next/image";
import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  Suspense,
  useEffect,
  useState,
} from "react";
import Comment from "./comment";
import { useFormStatus } from "react-dom";
import Suspense_comments from "./suspense/suspense_comments";
import Link from "next/link";

interface Props {
  post: Database["public"]["Tables"]["posts"]["Row"] & {
    profiles: Database["public"]["Tables"]["profiles"]["Row"];
    is_liked: boolean;
    is_self: boolean;
  };

  dropDownItems: MenuProps["items"];
  handleDropDownClick: MenuProps["onClick"];
  setIsPostModalOpen: Dispatch<SetStateAction<boolean>>;
  isPostModalOpen: boolean;
  setcomments_count: Dispatch<SetStateAction<number>>;
  comments_count: number;
}
function Post_modal({
  post,
  dropDownItems,
  handleDropDownClick,
  isPostModalOpen,
  setIsPostModalOpen,
  comments_count,
  setcomments_count,
}: Props) {
  const [isModalPostContentCut, setisModalPostContentCut] = useState(true);
  const [doneFetching, setdoneFetching] = useState(false);
  const [should_refresh, setShould_refresh] = useState(false);
  const [ModalpostContent, setModalPostContent] = useState<string | undefined>(
    post.content?.slice(0, 50)
  );
  const AddCommentActionBind = AddCommentAction.bind(null, post.id);
  const [comments, setComments] = useState<
    (Database["public"]["Tables"]["comments"]["Row"] & {
      profiles: Database["public"]["Tables"]["profiles"]["Row"];
      is_liked: boolean;
      is_self: boolean;
    })[]
  >([]);

  useEffect(() => {
    function getComments() {
      setdoneFetching(false);
      fetch(`/api/post/getComments?id=${post.id}`, { method: "GET" })
        .then((res) => res.json())
        .then((data) => {
          setComments(data.data);
          setdoneFetching(true);
        });
    }
    if (isPostModalOpen) {
      getComments();
    }
    setShould_refresh(false);
  }, [isPostModalOpen, should_refresh]);

  function SubmitButton() {
    const { pending } = useFormStatus();
    useEffect(() => {
      if (!pending) {
        setShould_refresh(true);
      }
    }, [pending]);
    return (
      <Button
        type="primary"
        loading={pending}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          e.currentTarget.form?.requestSubmit();
          e.currentTarget.form?.reset();
          setcomments_count(comments_count + 1);
        }}
        className="h-full p-2 px-10 text-white rounded-sm bg-primary"
      >
        Comment
      </Button>
    );
  }

  return (
    <Modal
      width={"60vw"}
      open={isPostModalOpen}
      centered
      onCancel={() => setIsPostModalOpen(false)}
      closeIcon={false}
      footer={null}
    >
      <div className="grid grid-cols-12 min-h-[400px] gap-2 ">
        <div className="grid col-span-6 place-content-center">
          <p>imgs</p>
        </div>
        <div className="grid grid-cols-12 col-span-6">
          {/* the post */}
          <div className="grid col-span-12 grid-cols-12 gap-x-[15px] gap-y-2 content-start ">
            {post.profiles.avatar_url && (
              <>
                <Link
                  href={
                    post.is_self
                      ? "/home/profile"
                      : `/home/profile?id=${post.user_id}`
                  }
                  className="self-start col-span-1 justify-self-start"
                >
                  <Avatar
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
                <div className="flex flex-col justify-between col-span-10 x">
                  <Link
                    href={
                      post.is_self
                        ? "/home/profile"
                        : `/home/profile?id=${post.user_id}`
                    }
                    className="text-sm font-semibold text-dark"
                  >
                    {post.profiles.username}
                  </Link>
                  <p className="h-[80px] overflow-y-auto hide-scrollbar ">
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
                <div className="grid content-start col-span-1 ">
                  <Dropdown
                    menu={{
                      items: dropDownItems,
                      onClick: handleDropDownClick,
                    }}
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
          </div>
          {/* comments */}
          <div className="grid col-span-12 grid-cols-12 gap-x-[15px] gap-y-2 content-start overflow-y-scroll box-content h-[60vh] hide-scrollbar">
            {comments &&
              comments?.map((comment, index) => {
                return (
                  <Comment
                    setcomments_count={setcomments_count}
                    comments_count={comments_count}
                    comment={comment}
                    index={index}
                    setComments={setComments}
                    comments={comments}
                    key={index * 2 + 45687}
                  />
                );
              })}
            {!doneFetching && comments.length === 0 && (
              <Suspense_comments count={comments_count} />
            )}
            {doneFetching && comments.length === 0 && (
              <p className="col-span-12 text-center text-gray-400 mt-14">
                Be the First to comment
              </p>
            )}
          </div>
        </div>
        <div className="grid content-end grid-cols-12 col-span-12 gap-x-2 gap-y-6">
          <div className="self-end col-span-12">
            <form action={AddCommentActionBind}>
              <div className="flex ">
                <input
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.currentTarget.form?.requestSubmit();
                      e.currentTarget.form?.reset();
                      setcomments_count(comments_count + 1);
                    }
                  }}
                  name="content"
                  type={"text"}
                  placeholder="Add a Comment"
                  className="w-full px-2 py-2 bg-gray-200 focus-visible:outline-none"
                />
                <SubmitButton />
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default Post_modal;
