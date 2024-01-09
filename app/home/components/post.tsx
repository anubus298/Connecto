"use client";

import incrementLikeAction from "@/app/lib/functions/user/incrementlike";
import { Database } from "@/utils/supabase/supabase";
import {
  faHeart,
  faComment,
  faShareFromSquare,
} from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";

interface Props {
  post: Database["public"]["Tables"]["posts"]["Row"] & {
    profiles: Database["public"]["Tables"]["profiles"]["Row"];
  };
  incrementLikeAction: any;
}
function Post({ post }: Props) {
  const date = new Date(post.created_at);
  const [likes_count, setlikes_count] = useState<number>(post.likes_count ?? 0);
  const [is_liked, setis_liked] = useState(false);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
  async function handle_like_click() {
    if (is_liked) {
      await incrementLikeAction(post.id);
      setlikes_count(likes_count - 1);
      setis_liked(false);
    } else {
      setlikes_count(likes_count + 1);
      setis_liked(true);
    }
  }
  return (
    <div className="flex flex-col gap-6 p-3 bg-white">
      <div className="flex items-center justify-between">
        <div className="">
          {post.profiles.avatar_url && (
            <div className="flex items-center gap-2">
              <div className="rounded-full size-[30px] overflow-hidden flex justify-center items-center">
                <Image
                  src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${post.profiles.avatar_url}`}
                  height={30}
                  width={30}
                  alt={post.profiles.username + " avatar"}
                />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-semibold">
                  {post.profiles.username}
                </p>
                <p className="text-xs text-gray-400">{formattedDate}</p>
              </div>
            </div>
          )}
        </div>
        <button>
          <FontAwesomeIcon icon={faEllipsisV} />
        </button>
      </div>
      <p>{post.content}</p>
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
        <button className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
          <FontAwesomeIcon icon={faComment} />
          <p className="text-sm">{post.comments_count} Comments</p>
        </button>
        <button className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
          <FontAwesomeIcon icon={faShareFromSquare} />
          <p className="text-sm">{post.comments_count} Shares</p>
        </button>
      </div>
    </div>
  );
}

export default Post;
