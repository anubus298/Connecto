"use client";
import incrementLikeAction from "@/app/lib/functions/user/post/incrementlike";
import { Dropdown, MenuProps, Modal } from "antd";
import decrementLikeAction from "@/app/lib/functions/user/post/decrementlike";
import {
  faHeart,
  faComment,
  faShareFromSquare,
  faBookmark,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import {
  faFlag,
  faHeart as faHeartSolid,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import deletePostAction from "@/app/lib/functions/user/post/deletePost";
import Post_modal from "./post_modal";
import Link from "next/link";
import { CarouselRef } from "antd/es/carousel";
import { Post } from "../home_main";
import Asset_modal from "./asset_modal";
import Share_modal from "./share_modal";
import { Tables } from "@/utils/supabase/supabase";
import Avatar_comp from "@/app/components/avatar_comp";
import bookmarkPostAction from "@/app/lib/functions/user/post/bookmarkPost";
import unbookmarkPostAction from "@/app/lib/functions/user/post/unbookmarkPost";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/navigation";

interface Props {
  post: Post;
  user_id: string;
  show_share?: boolean;
  show_buttons?: boolean;
  show_save?: boolean;
  my_profile: NonNullable<Tables<"profiles">>;
  additional_key?: string;
  show_small?: boolean;
  is_in_page?: boolean;
}
function Post({
  post,
  user_id,
  my_profile,
  show_share = true,
  show_buttons = true,
  show_save = true,
  additional_key,
  show_small = false,
  is_in_page = false,
}: Props) {
  const CarouselRef = useRef<CarouselRef>(null);
  const baseUrl: string | undefined = post?.media_url?.slice(
    0,
    post.media_url.lastIndexOf("/") + 1
  );
  const assets_count: number =
    post.media_url
      ?.slice(post.media_url.lastIndexOf("/") + 1, post.media_url.length ?? 0)
      .split(",").length ?? 1;
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const postRef = useRef<HTMLDivElement>(null);
  const [isAssetsModalOpen, setIsAssetsModalOpen] = useState(false);
  const router = useRouter();
  const [is_deleting_post_pending, setis_deleting_post_pending] =
    useState(false);
  const date = new Date(post.created_at);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
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
  if (user_id === post.user_id) {
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
      {
        key: "3",
        label: (
          <div className="flex items-center gap-2 text-dark">
            <FontAwesomeIcon icon={faEyeSlash} />
            <p>Hide</p>
          </div>
        ),
      },
    ];
  }
  !is_in_page &&
    items.unshift({
      key: "4",
      label: (
        <Link
          href={"/home/post?id=" + post.id}
          className="flex items-center gap-2 text-dark"
        >
          <FontAwesomeIcon icon={faEye} />
          <p>View the post</p>
        </Link>
      ),
    });
  const [likes_count, setlikes_count] = useState<number>(post.likes_count ?? 0);
  const [initialSlide, setinitialSlide] = useState(0);
  const [comments_count, setcomments_count] = useState<number>(
    post.comments_count ?? 0
  );
  const [is_liked, setis_liked] = useState(post.is_liked);
  const [is_saved, setis_saved] = useState(post.is_saved);
  const [shareCount, setShareCount] = useState(post.shares_count ?? 0);
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
  async function handle_save_click() {
    if (is_saved) {
      setis_saved(false);
      await unbookmarkPostAction(post.id);
    } else {
      setis_saved(true);
      await bookmarkPostAction(post.id);
    }
  }
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    setFormattedDate(getPrettyDate(post.created_at));
  }, []);
  return (
    <article
      ref={postRef}
      className="flex flex-col gap-6 p-2 bg-white rounded-md md:p-3"
      key={additional_key ?? undefined}
    >
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
      {/*share modal*/}
      <Share_modal
        user_id={user_id}
        my_profile={my_profile}
        isShareModalOpen={isShareModalOpen}
        setIsShareModalOpen={setIsShareModalOpen}
        post={post}
        setShareCount={setShareCount}
        shareCount={shareCount}
      />

      {/* assets post modal */}
      {post.media_url && (
        <Asset_modal
          initialSlide={initialSlide}
          CarouselRef={CarouselRef}
          assets_count={assets_count}
          post={post}
          isAssetsModalOpen={isAssetsModalOpen}
          setIsAssetsModalOpen={setIsAssetsModalOpen}
        />
      )}
      {/* post modal */}
      {!is_in_page && (
        <Post_modal
          user_id={user_id}
          my_profile={my_profile}
          comments={[]}
          setcomments_count={setcomments_count}
          post={post}
          isPostModalOpen={isPostModalOpen}
          setIsPostModalOpen={setIsPostModalOpen}
        />
      )}
      {/*real post*/}
      <div className="flex items-center justify-between">
        <div className="">
          {post.profiles.avatar_url && (
            <div className="flex items-center gap-2">
              <Link
                className="col-span-1"
                href={
                  post.user_id === user_id
                    ? "/home/profile"
                    : `/home/profile?id=${post.user_id}`
                }
              >
                <Avatar_comp
                  src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${post.profiles.avatar_url}`}
                  height={30}
                  width={30}
                  alt={post.profiles.username + " avatar"}
                />
              </Link>
              <div className="flex flex-col">
                <Link
                  href={
                    post.user_id === user_id
                      ? "/home/profile"
                      : `/home/profile?id=${post.user_id}`
                  }
                  className="text-sm font-semibold"
                >
                  {post.profiles.username}{" "}
                  {
                    <span className="font-normal">
                      {decide_poster_action(post.type)}
                    </span>
                  }
                </Link>
                <time
                  dateTime={post.created_at}
                  className="text-xs text-gray-400"
                >
                  {formattedDate}
                </time>
              </div>
            </div>
          )}
        </div>

        {show_buttons && (
          <div className="flex gap-4">
            {(show_small || isTabletOrMobile) && show_save && (
              <button onClick={handle_save_click}>
                <FontAwesomeIcon
                  icon={is_saved ? faBookmarkSolid : faBookmark}
                  className={is_saved ? "text-primary" : ""}
                />
              </button>
            )}
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
        )}
      </div>
      {postContent && (
        <p className="whitespace-pre-line">
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
      )}
      {/* for shared type */}
      {post?.post && (
        <div className="w-full border-2 border-gray-200 rounded-md">
          <Post
            user_id={user_id}
            additional_key={"addditionqéé866" + post.post.id}
            show_share={false}
            show_save={false}
            post={post.post}
            my_profile={my_profile}
          />
        </div>
      )}
      {post.media_url && assets_count >= 4 ? (
        <div className=" w-full overflow-hidden max-h-[600px] grid grid-cols-2 grid-rows-2 gap-1">
          {post.media_url
            .slice(post.media_url.lastIndexOf("/") + 1, post.media_url.length)
            .split(",")
            .slice(0, 4)
            .map((img_src, index) => {
              return (
                <div
                  className="min-h-[200px] overflow-hidden col-span-1 relative"
                  key={img_src + 1 + index * 9}
                >
                  {img_src.split(".")[1] === "mp4" ? (
                    <video
                      controls
                      controlsList="nodownload"
                      style={{
                        width: "100%",
                        height: "100%",
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
                      onClick={() => {
                        setIsAssetsModalOpen(true);
                        setinitialSlide(index);
                        CarouselRef.current?.goTo(index, false);
                      }}
                      className="cursor-pointer"
                      style={{ objectFit: "cover" }}
                      fill
                      alt={"post media number " + index}
                    />
                  )}
                  {index === 3 && assets_count - 4 > 0 && (
                    <h6 className="absolute p-1 text-sm font-medium bg-white rounded-md cursor-pointer bottom-2 right-2 text-dark">
                      {assets_count - 4 + " more"}
                    </h6>
                  )}
                </div>
              );
            })}
        </div>
      ) : post.media_url && assets_count == 3 ? (
        <div className=" w-full overflow-hidden max-h-[600px] grid grid-cols-2 grid-rows-2 gap-1">
          {post.media_url
            .slice(post.media_url.lastIndexOf("/") + 1, post.media_url.length)
            .split(",")
            .map((img_src, index) => {
              return (
                <div
                  className={
                    " overflow-hidden relative " +
                    (index === 0
                      ? " row-start-1 row-end-3 col-start-1 col-end-2 min-h-[200px]"
                      : index === 1
                        ? "row-start-1 row-end-2 col-start-2 col-end-3 min-h-[200px]"
                        : "row-start-2 row-end-3 col-start-2 col-end-3 min-h-[200px]")
                  }
                  key={img_src + 1 + index * 9}
                >
                  {img_src.split(".")[1] === "mp4" ? (
                    <video
                      controls
                      controlsList="nodownload"
                      style={{
                        width: "100%",
                        height: "100%",
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
                      fill
                      onClick={() => {
                        setIsAssetsModalOpen(true);
                        setinitialSlide(index);
                        CarouselRef.current?.goTo(index, false);
                      }}
                      className="cursor-pointer "
                      style={{ objectFit: "cover" }}
                      alt={"post media number " + index}
                    />
                  )}
                </div>
              );
            })}
        </div>
      ) : post.media_url && assets_count == 2 ? (
        <div className=" w-full overflow-hidden max-h-[600px] grid grid-cols-2 gap-1">
          {post.media_url
            .slice(post.media_url.lastIndexOf("/") + 1, post.media_url.length)
            .split(",")
            .map((img_src, index) => {
              return (
                <div
                  className={
                    "max-h-[600px] overflow-hidden col-span-1 relative "
                  }
                  key={img_src + 1 + index * 9}
                >
                  {img_src.split(".")[1] === "mp4" ? (
                    <video
                      controls
                      controlsList="nodownload"
                      style={{
                        width: "100%",
                        height: "100%",
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
                      fill
                      onClick={() => {
                        setIsAssetsModalOpen(true);
                        setinitialSlide(index);
                        CarouselRef.current?.goTo(index, false);
                      }}
                      className="cursor-pointer "
                      style={{ objectFit: "cover" }}
                      alt={"post media number " + index}
                    />
                  )}
                </div>
              );
            })}
        </div>
      ) : (
        post.media_url && (
          <div
            className={
              "w-full overflow-hidden grid grid-cols-1 " +
              (!is_in_page && "max-h-[600px]")
            }
          >
            {post.media_url
              .slice(post.media_url.lastIndexOf("/") + 1, post.media_url.length)
              .split(",")
              .map((img_src, index) => {
                return (
                  <div
                    className={
                      "overflow-hidden col-span-1 relative min-h-[200px]"
                    }
                    key={img_src + 1 + index * 9}
                  >
                    {img_src.split(".")[1] === "mp4" ? (
                      <video
                        controls
                        controlsList="nodownload"
                        style={{
                          width: "100%",
                          height: "100%",
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
                        height={!is_in_page ? 600 : 800}
                        width={!is_in_page ? 600 : 800}
                        onClick={() => {
                          CarouselRef.current?.goTo(index, false);
                          setIsAssetsModalOpen(true);
                        }}
                        className={"cursor-pointer " + (is_in_page && "h-auto")}
                        alt={"post media number " + index}
                      />
                    )}
                  </div>
                );
              })}
          </div>
        )
      )}
      {show_buttons && (
        <footer className="flex w-full gap-2">
          <button
            onClick={handle_like_click}
            className="flex items-center justify-center gap-2 p-2 bg-gray-100 rounded-md md:min-w-32"
          >
            <FontAwesomeIcon
              icon={is_liked ? faHeartSolid : faHeart}
              className={is_liked ? "text-primary" : ""}
            />
            <p className="text-sm">{likes_count} likes</p>
          </button>
          <button
            onClick={() => !is_in_page && setIsPostModalOpen(true)}
            className="flex items-center justify-center gap-2 p-2 bg-gray-100 rounded-md md:min-w-32"
          >
            <FontAwesomeIcon icon={faComment} />
            <p className="text-sm">{comments_count} Comments</p>
          </button>
          {!(post.user_id === user_id) &&
            post.type === "default" &&
            show_share && (
              <button
                className="flex items-center justify-center gap-2 p-2 bg-gray-100 rounded-md md:min-w-32"
                onClick={() => setIsShareModalOpen(true)}
              >
                <FontAwesomeIcon icon={faShareFromSquare} />
                <p className="text-sm">{post.shares_count} Shares</p>
              </button>
            )}
          {!show_small && !isTabletOrMobile && show_save && (
            <button
              onClick={handle_save_click}
              className="flex items-center justify-center gap-2 p-2 bg-gray-100 rounded-md md:min-w-32"
            >
              <FontAwesomeIcon
                icon={is_saved ? faBookmarkSolid : faBookmark}
                className={is_saved ? "text-primary" : ""}
              />
              <p className="text-sm">{is_saved ? "Saved" : "Save"}</p>
            </button>
          )}
        </footer>
      )}
    </article>
  );
}
export function decide_poster_action(post_type: string) {
  if (post_type === "shared") {
    return "shared a post";
  } else if (post_type === "profile") {
    return "updated his profile";
  } else {
    return "posted";
  }
}
export default Post;

export function getPrettyDate(date: string): string {
  const targetDate = new Date(date);
  const currentDate = new Date();
  const now: number = targetDate.getTime() - currentDate.getTime();

  // Calculate the absolute difference in seconds
  const absDiffInSeconds = Math.abs(now / 1000);

  // Future date
  if (absDiffInSeconds >= 2592000) {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    }).format(targetDate);
  } else if (absDiffInSeconds >= 86400) {
    const diffInDays = Math.floor(absDiffInSeconds / 86400);
    return new Intl.RelativeTimeFormat("en").format(-diffInDays, "day");
  } else if (absDiffInSeconds >= 3600) {
    const diffInHours = Math.floor(absDiffInSeconds / 3600);
    return new Intl.RelativeTimeFormat("en").format(-diffInHours, "hour");
  } else if (absDiffInSeconds >= 60) {
    const diffInMinutes = Math.floor(absDiffInSeconds / 60);
    return new Intl.RelativeTimeFormat("en").format(-diffInMinutes, "minute");
  } else if (absDiffInSeconds >= 10) {
    const diffInSeconds = Math.floor(absDiffInSeconds);
    return new Intl.RelativeTimeFormat("en").format(-diffInSeconds, "seconds");
  } else {
    return "now";
  }
}
