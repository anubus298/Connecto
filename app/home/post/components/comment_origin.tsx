"use client";
import Link from "next/link";
import { Comment } from "./comments_section";
import Avatar_comp from "@/app/components/avatar_comp";
import { getPrettyDate } from "../../components/post";
import { useEffect, useState } from "react";
import {
  faComment,
  faFlag,
  faHeart,
} from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faTrash, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MenuProps, Dropdown } from "antd";
import decrementLikeOnCommentAction from "@/app/lib/functions/user/post/decrementLikeOnComment";
import incrementLikeOnCommentAction from "@/app/lib/functions/user/post/incrementLikeOnComment";
import { useMediaQuery } from "react-responsive";

interface Props {
  comment: Comment;
}

function Comment_origin({ comment }: Props) {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const [prettyDate, setPrettyDate] = useState("");
  useEffect(() => {
    setPrettyDate(getPrettyDate(comment.created_at));
  }, []);
  const [likes_count, setLikes_count] = useState<number>(
    comment.likes_count ?? 0
  );
  const [replies_count, setReplies_count] = useState<number>(
    comment.replies_count ?? 0
  );
  const [is_liked, setis_liked] = useState(comment.is_liked);
  let items: MenuProps["items"];
  if (comment.is_self) {
    items = [
      {
        key: "1",
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
  const handleDropDownClick: MenuProps["onClick"] = async ({ key }) => {
    if (key == "1") {
    }
  };
  async function handle_like_click() {
    if (is_liked) {
      setLikes_count(likes_count - 1);
      setis_liked(false);
      await decrementLikeOnCommentAction(comment.comment_id);
    } else {
      setLikes_count(likes_count + 1);
      setis_liked(true);
      await incrementLikeOnCommentAction(comment.comment_id);
    }
  }
  return (
    <div className="p-1 bg-white border-2 rounded-md h-fit ">
      <div className="flex w-full gap-1 h-fit">
        <div className="size-[30px]">
          {comment.profiles.avatar_url && (
            <Link
              href={
                comment.is_self
                  ? "/home/profile"
                  : `/home/profile?id=${comment.user_id}`
              }
            >
              <Avatar_comp
                className="col-span-1 "
                src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${comment.profiles.avatar_url}`}
                height={isTabletOrMobile ? 25 : 30}
                width={isTabletOrMobile ? 25 : 30}
                alt={comment.profiles.username + " avatar"}
              />
            </Link>
          )}
        </div>
        <div className="flex flex-col w-full h-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Link
                href={
                  comment.is_self
                    ? "/home/profile"
                    : `/home/profile?id=${comment.user_id}`
                }
                className="text-sm font-semibold text-dark md:text-base"
              >
                {comment.profiles.username}
              </Link>
              <time
                className="text-xs text-gray-600"
                dateTime={comment.created_at}
              >
                {prettyDate}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Dropdown
                menu={{ items, onClick: handleDropDownClick }}
                trigger={["click"]}
                placement="bottomLeft"
              >
                <button>
                  <FontAwesomeIcon icon={faEllipsisH} />
                </button>
              </Dropdown>
            </div>
          </div>
          <div>
            <p className="p-1 text-sm whitespace-pre-wrap rounded-lg md:text-base ">
              {comment.content}
            </p>
          </div>
          <div className="flex">
            <button
              onClick={handle_like_click}
              className="flex items-center justify-center gap-1 p-1 text-sm rounded-md md:text-base"
            >
              <p className="text-sm">{likes_count}</p>
              <FontAwesomeIcon
                icon={is_liked ? faHeartSolid : faHeart}
                className={"text-sm " + (is_liked ? "text-primary" : "")}
              />
            </button>
            <button className="flex items-center justify-center gap-1 p-1 text-sm rounded-md md:text-base">
              <p className="text-sm">{replies_count}</p>
              <FontAwesomeIcon icon={faComment} className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comment_origin;
