"use client";
import {
  faHeart,
  faComment,
  faEyeSlash,
} from "@fortawesome/free-regular-svg-icons";
import {
  faEllipsisH,
  faFlag,
  faHeart as faHeartSolid,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import decrementLikeOnCommentAction from "@/app/lib/functions/user/post/decrementLikeOnComment";
import incrementLikeOnCommentAction from "@/app/lib/functions/user/post/incrementLikeOnComment";
import { Database } from "@/utils/supabase/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown, MenuProps, Modal } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import deleteCommentAction from "@/app/lib/functions/user/post/deleteComment";
import Link from "next/link";
import Avatar_comp from "@/app/components/avatar_comp";

interface Props {
  comment: Database["public"]["Tables"]["comments"]["Row"] & {
    profiles: Database["public"]["Tables"]["profiles"]["Row"];
    is_liked: boolean;
    is_self: boolean;
  };
  setcomments_count: Dispatch<SetStateAction<number>>;
  comments_count: number;
  index: number;
  comments: ({
    comment_id: number;
    content: string;
    created_at: string;
    likes_count: number;
    post_id: number;
    replies_count: number;
    user_id: string;
  } & {
    profiles: Database["public"]["Tables"]["profiles"]["Row"];
    is_liked: boolean;
    is_self: boolean;
  })[];
  setComments: Dispatch<
    SetStateAction<
      ({
        comment_id: number;
        content: string;
        created_at: string;
        likes_count: number;
        post_id: number;
        replies_count: number;
        user_id: string;
      } & {
        profiles: Database["public"]["Tables"]["profiles"]["Row"];
        is_liked: boolean;
        is_self: boolean;
      })[]
    >
  >;
}
function Comment({
  comment,
  comments,
  setComments,
  setcomments_count,
  comments_count,
  index,
}: Props) {
  const handleDropDownClick: MenuProps["onClick"] = async ({ key }) => {
    if (key == "1") {
      setIsDeleteModalOpen(true);
    }
    if (key == "hide") {
      setis_hide(true);
    }
  };
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
        key: "hide",
        label: (
          <div className="flex items-center gap-2 text-dark">
            <FontAwesomeIcon icon={faEyeSlash} />
            <p>Hide</p>
          </div>
        ),
      },
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
  const [likes_count, setlikes_count] = useState<number>(
    comment.likes_count ?? 0
  );
  const [is_hide, setis_hide] = useState(false);
  const [is_pending, setis_pending] = useState(false);
  const [replies_count, setReplies_count] = useState<number>(
    comment.replies_count ?? 0
  );
  const [is_liked, setis_liked] = useState(comment.is_liked);
  async function handle_like_click() {
    if (is_liked) {
      setlikes_count(likes_count - 1);
      setis_liked(false);
      await decrementLikeOnCommentAction(comment.comment_id);
    } else {
      setlikes_count(likes_count + 1);
      setis_liked(true);
      await incrementLikeOnCommentAction(comment.comment_id);
    }
  }
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  return !is_hide ? (
    <>
      <Modal
        title="Delete Comment"
        centered
        open={isDeleteModalOpen}
        okButtonProps={{
          loading: is_pending,
        }}
        onOk={async () => {
          setis_pending(true);
          await deleteCommentAction(comment.comment_id);
          setis_pending(false);
          if (comments_count > 0) {
            setcomments_count(comments_count - 1);
          }
          const newComments = [...comments];
          newComments.splice(index, 1);
          setComments(newComments);
          setIsDeleteModalOpen(false);
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
      >
        <p>
          Are you sure you want to delete the comment? This action cannot be
          undone
        </p>
      </Modal>
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
            height={30}
            width={30}
            alt={comment.profiles.username + " avatar"}
          />
        </Link>
      )}
      <article className="flex flex-col col-span-10 ">
        <Link
          href={
            comment.is_self
              ? "/home/profile"
              : `/home/profile?id=${comment.user_id}`
          }
          className="text-sm font-semibold text-dark"
        >
          {comment.profiles.username}
        </Link>
        <p className="px-1 py-1 rounded-sm bg-gray-50">{comment.content}</p>
        <div className="flex justify-end">
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
      </article>
      <div className="flex flex-col col-span-1 me-2">
        <button
          onClick={handle_like_click}
          className="flex items-center justify-center gap-1 p-1 rounded-md"
        >
          <p className="text-sm">{likes_count}</p>
          <FontAwesomeIcon
            icon={is_liked ? faHeartSolid : faHeart}
            className={is_liked ? "text-primary" : ""}
          />
        </button>
        <button className="flex items-center justify-center gap-1 p-1 rounded-md">
          <p className="text-sm">{replies_count}</p>
          <FontAwesomeIcon icon={faComment} />
        </button>
      </div>
    </>
  ) : (
    <>
      <div className="grid justify-center grid-cols-12 col-span-12 my-2">
        <div className="flex justify-center col-start-2 col-end-12 py-2 rounded-md select-none bg-gray-50">
          <h6>This comment is hidden</h6>
        </div>
      </div>
    </>
  );
}

export default Comment;
