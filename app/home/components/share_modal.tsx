"use client";

import shareToProfileAction from "@/app/lib/functions/user/post/shareToProfile";
import { Button, Modal } from "antd";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

//prettier-ignore
//@ts-ignore
import { useFormStatus } from "react-dom";

import Link from "next/link";
import Post from "./post";

import { Tables } from "@/utils/supabase/supabase";
import Avatar_comp from "@/app/components/avatar_comp";

interface Props {
  post: Post;
  isShareModalOpen: boolean;
  setIsShareModalOpen: Dispatch<SetStateAction<boolean>>;
  shareCount: number;
  setShareCount: Dispatch<SetStateAction<number>>;
  my_profile: NonNullable<Tables<"profiles">>;
  user_id: string;
}
function Share_modal({
  post,
  isShareModalOpen,
  setIsShareModalOpen,
  shareCount,
  setShareCount,
  my_profile,
  user_id,
}: Props) {
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [is_req_sending, setIs_req_sending] = useState(false);
  const [is_outer_pending, setis_outer_pending] = useState(false);
  function SubmitButton() {
    const { pending } = useFormStatus();
    useEffect(() => {
      if (pending) {
        setis_outer_pending(true);
      }
      if (is_req_sending && !pending) {
        setIsShareModalOpen(false);
        setis_outer_pending(false);
      }
    }, [pending]);
    return (
      <Button
        type="primary"
        ref={submitButtonRef}
        loading={pending}
        className="hidden"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          setIs_req_sending(true);

          e.currentTarget.form?.requestSubmit();

          setShareCount(shareCount + 1);
        }}
      >
        Share
      </Button>
    );
  }
  const baseUrl: string | undefined = post?.media_url?.slice(
    0,
    post.media_url.lastIndexOf("/") + 1
  );
  const bindShareToProfileAction = shareToProfileAction.bind(null, post.id);
  return (
    <Modal
      destroyOnClose
      open={isShareModalOpen}
      centered
      onCancel={() => setIsShareModalOpen(false)}
      okText="Share"
      okButtonProps={{
        onClick: () => submitButtonRef.current?.click(),
        loading: is_outer_pending,
      }}
    >
      <div className="grid grid-cols-12 gap-2 overflow-hidden ">
        <div className="relative col-span-12 min-h-[50vh] overflow-hidden rounded-md">
          <div className="">
            <div className="w-full">
              {my_profile && my_profile.avatar_url && (
                <div className="flex items-center gap-2 mb-6">
                  <Link className="col-span-1 text-dark" href={"/home/profile"}>
                    <Avatar_comp
                      src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${my_profile.avatar_url}`}
                      height={30}
                      width={30}
                      alt={my_profile.username + " avatar"}
                    />
                  </Link>
                  <div className="flex flex-col">
                    <Link
                      href={"/home/profile"}
                      className="text-sm font-semibold text-dark"
                    >
                      {my_profile.username} Shared a post
                    </Link>
                    <p className="text-xs text-gray-400">now</p>
                  </div>
                </div>
              )}
              <form
                className="w-full px-2 mb-6"
                action={bindShareToProfileAction}
              >
                <textarea
                  disabled={is_outer_pending}
                  name="content"
                  placeholder="Write something"
                  className="w-full resize-none focus-visible:outline-none"
                />
                <SubmitButton />
              </form>
            </div>
            <div className="border-2 border-gray-100 rounded-md">
              <Post
                my_profile={my_profile}
                user_id={user_id}
                post={post}
                show_share={false}
                show_buttons={false}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default Share_modal;
