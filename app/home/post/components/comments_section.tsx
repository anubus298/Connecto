"use client";
//prettier-ignore
//@ts-ignore
import { useFormStatus } from "react-dom";
import AddCommentAction from "@/app/lib/functions/user/post/addComment";
import { Button, Dropdown, MenuProps } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import { Tables } from "@/utils/supabase/supabase";
import { Profile } from "../../home_main";
import Comment_origin from "./comment_origin";
import { faClock, faStar, faUser } from "@fortawesome/free-regular-svg-icons";
import React, { Dispatch, SetStateAction, useState } from "react";
import useFetchPage from "@/app/lib/hooks/useFetchPage";
import InfiniteScroll from "react-infinite-scroll-component";

export type Comment = Tables<"comments"> & {
  profiles: Profile;
  is_liked: boolean;
  is_self: boolean;
};
interface Props {
  post_id: number;
  comments: (Tables<"comments"> & {
    profiles: Profile;
    is_liked: boolean;
    is_self: boolean;
  })[];
  setcomments_count?: Dispatch<SetStateAction<number>>;
}
function Comments_section({ post_id, comments, setcomments_count }: Props) {
  const AddCommentActionBind = AddCommentAction.bind(null, post_id);
  const [order, setOrder] = useState({ key: "created_at", value: false });
  const [orderKey, setOrderKey] = useState("Recent");
  const [from, setFrom] = useState(0);
  const { list, hasMore } = useFetchPage<Comment>(
    "/api/post/getComments",
    { id: post_id, orderKey: order.key, state: order.value },
    comments,
    from,
    from + 10
  );
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
          setcomments_count && setcomments_count((prev) => prev + 1);
        }}
      >
        Comment
      </Button>
    );
  }
  let items: MenuProps["items"] = [
    { key: "top", label: "Top", icon: <FontAwesomeIcon icon={faStar} /> },
    {
      key: "recent",
      label: "Recent",
      icon: <FontAwesomeIcon icon={faClock} />,
    },
    {
      key: "friends",
      label: "Friends",
      icon: <FontAwesomeIcon icon={faUser} />,
    },
  ];
  const handleDropDownClick: MenuProps["onClick"] = async ({ key }) => {
    if (key === "recent") {
      setOrderKey("Recent");
      setOrder({ key: "created_at", value: false });
      setFrom(0);
    } else if (key === "top") {
      setOrderKey("Top");

      setOrder({ key: "likes_count", value: false });
      setFrom(0);
    }
  };
  const [is_first_time, setis_first_time] = useState(true);
  return (
    <div className="w-full p-2 bg-gray-100 rounded-md md:p-3">
      <div className="flex flex-col items-end w-full px-1 sm:px-2 md:px-4">
        <div className="">
          <Dropdown
            menu={{ items, onClick: handleDropDownClick }}
            trigger={["click"]}
            placement="bottomLeft"
          >
            <Button
              icon={
                <div className="flex items-center justify-center">
                  <FontAwesomeIcon icon={faSortDown} />
                </div>
              }
            >
              {orderKey}
            </Button>
          </Dropdown>
        </div>
        <div className="flex flex-col w-full mt-2 md:gap-0">
          <InfiniteScroll
            style={{
              rowGap: "1.25rem",
              overflowX: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
            loader={
              <div className="flex justify-center w-full">
                <Button type="text" loading className="font-medium">
                  Loading
                </Button>
              </div>
            }
            hasMore={hasMore}
            dataLength={list.length}
            next={() => {
              if (is_first_time) {
                setFrom(
                  (prev) => prev + (comments.length === 0 ? 1 : comments.length)
                );
                setis_first_time(false);
              } else {
                setFrom((prev) => prev + 10);
              }
            }}
          >
            {list.length === 0 && (
              <div className="flex justify-center w-full p-3 h-14">
                <h6 className="text-gray-400">Be first to comment</h6>
              </div>
            )}
            {list.map((comment) => {
              return (
                <Comment_origin comment={comment} key={comment.comment_id} />
              );
            })}
          </InfiniteScroll>
        </div>
        <form action={AddCommentActionBind} className="w-full mt-4">
          <input
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
                e.currentTarget.form?.reset();
                setFrom((prev) => prev + 1);
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
  );
}

export default Comments_section;
