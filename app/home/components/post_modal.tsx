"use client";

import {
  faArrowLeft,
  faArrowRight,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddCommentAction from "@/app/lib/functions/user/post/addComment";
import { Database } from "@/utils/supabase/supabase";
import { Avatar, Button, Carousel, Dropdown, MenuProps, Modal } from "antd";
import Image from "next/image";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
//prettier-ignore
//@ts-ignore
import { useFormStatus } from "react-dom";
import Comment from "./comment";
import Suspense_comments from "./suspense/suspense_comments";
import Link from "next/link";
import { CarouselRef } from "antd/es/carousel";
import { useMediaQuery } from "react-responsive";
import Avatar_comp from "@/app/components/avatar_comp";

interface Props {
  post: Database["public"]["Tables"]["posts"]["Row"] & {
    profiles: {
      avatar_url: string | null;
      username: string;
      id: number;
    };
    is_liked: boolean;
    is_self: boolean;
  };

  dropDownItems: MenuProps["items"];
  handleDropDownClick: MenuProps["onClick"];
  setIsPostModalOpen: Dispatch<SetStateAction<boolean>>;
  isPostModalOpen: boolean;
  setcomments_count: Dispatch<SetStateAction<number>>;
  comments_count: number;
  setIsAssetsModalOpen: Dispatch<SetStateAction<boolean>>;
}
function Post_modal({
  post,
  dropDownItems,
  handleDropDownClick,
  isPostModalOpen,
  setIsPostModalOpen,
  comments_count,
  setcomments_count,
  setIsAssetsModalOpen,
}: Props) {
  const baseUrl: string | undefined = post?.media_url?.slice(
    0,
    post.media_url.lastIndexOf("/") + 1
  );
  const assets_count: number =
    post.media_url
      ?.slice(post.media_url.lastIndexOf("/") + 1, post.media_url.length ?? 0)
      .split(",").length ?? 1;
  const [isModalPostContentCut, setisModalPostContentCut] = useState(true);
  const isMediumScreen = useMediaQuery({ query: "(max-width: 768px)" });
  const [doneFetching, setDoneFetching] = useState(false);

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
  const CarouselRef = useRef<CarouselRef>(null);
  useEffect(() => {
    function getComments() {
      setDoneFetching(false);
      fetch(`/api/post/getComments?id=${post.id}`, { method: "GET" })
        .then((res) => res.json())
        .then((data) => {
          setComments(data.data);
          setDoneFetching(true);
        });
    }
    if (isPostModalOpen) {
      getComments();
    }
  }, [isPostModalOpen]);

  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button
        type="primary"
        loading={pending}
        className="w-2/12 h-full p-1 text-xs rounded-l-none rounded-r-sm md:p-2 md:text-base"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          e.currentTarget.form?.requestSubmit();
          e.currentTarget.form?.reset();
          setcomments_count(comments_count + 1);
        }}
      >
        Comment
      </Button>
    );
  }

  return (
    <Modal
      width={isMediumScreen ? "100vw" : "60vw"}
      open={isPostModalOpen}
      centered
      onCancel={() => setIsPostModalOpen(false)}
      footer={null}
    >
      <div className="grid grid-cols-12 overflow-hidden min-h-[400px] gap-2 ">
        <div className="relative col-span-12 md:col-span-6 max-h-[50vh] md:max-h-none md:h-[85vh] overflow-hidden bg-gray-100 rounded-md">
          {post.media_url && (
            <div className="w-full h-full">
              <Carousel
                infinite={false}
                className="w-full h-full"
                ref={CarouselRef}
                dots={false}
              >
                {post.media_url
                  .slice(
                    post.media_url.lastIndexOf("/") + 1,
                    post.media_url.length
                  )
                  .split(",")
                  .map((img_src, index) => {
                    return (
                      <div
                        className="flex items-center justify-center w-full md:h-[85vh]"
                        key={img_src + index * 11}
                      >
                        {img_src.split(".")[1] === "mp4" ? (
                          <video
                            controls
                            controlsList="nodownload"
                            style={{
                              width: 600,
                              height: 300,
                              display: "block",
                            }}
                          >
                            <source
                              src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/${baseUrl}${img_src}`}
                              type="video/mp4"
                            />
                          </video>
                        ) : (
                          <Image
                            src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/${baseUrl}${img_src}`}
                            height={300}
                            onClick={() => {
                              setIsAssetsModalOpen(true);
                              CarouselRef.current?.goTo(index, false);
                            }}
                            className="h-auto cursor-pointer"
                            style={{ objectFit: "cover" }}
                            width={350}
                            // alt={"post asset number " + Number(index + 1)}
                            alt={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/${baseUrl}${img_src}`}
                          />
                        )}
                      </div>
                    );
                  })}
              </Carousel>
              {assets_count > 1 && (
                <>
                  <button
                    className="absolute bottom-0 right-0 flex items-center justify-center p-1 m-2 text-white rounded-md bg-primary size-6"
                    onClick={() => CarouselRef.current?.next()}
                  >
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                  <button
                    className="absolute bottom-0 left-0 flex items-center justify-center p-1 m-2 text-white rounded-md bg-primary size-6"
                    onClick={() => CarouselRef.current?.prev()}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </button>
                </>
              )}
            </div>
          )}
          {!post.media_url && (
            <div className="flex items-center justify-center w-full h-full">
              <h6 className="text-center">No media</h6>
            </div>
          )}
        </div>
        <div className="grid grid-cols-12 col-span-12 md:col-span-6 md:h-[85vh]">
          {/* the post */}
          <div className="grid content-start grid-cols-12 col-span-12 gap-x-4 gap-y-2 ">
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
                  <Avatar_comp
                    src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${post.profiles.avatar_url}`}
                    height={30}
                    width={30}
                    alt={post.profiles.username + " avatar"}
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
          <div className="grid mt-4 col-span-12 grid-cols-12 gap-x-[15px] gap-y-2 content-start overflow-y-scroll box-content h-[60vh] hide-scrollbar">
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
              <p className="col-span-12 mt-20 text-lg text-center text-gray-400">
                Be the First to comment
              </p>
            )}
          </div>
        </div>
        <div className="grid content-end grid-cols-12 col-span-12 gap-x-2 gap-y-6">
          <div className="self-end col-span-12">
            <form action={AddCommentActionBind} className="">
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
                className="w-10/12 p-1 bg-gray-200 md:p-2 focus-visible:outline-none"
              />
              <SubmitButton />
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default Post_modal;
