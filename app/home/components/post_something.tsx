"use client";

import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

interface Props {
  avatar: string | null | undefined;
  postAction: any;
}
function Post_something({ avatar, postAction }: Props) {
  return (
    <div className="flex flex-col w-full gap-1 p-2 my-1 bg-white">
      <h4 className="font-semibold">Post Something</h4>
      <hr />
      <form action={postAction} className="flex flex-col items-end gap-2">
        <div className="flex w-full">
          <div className="rounded-full size-[40px] overflow-hidden flex justify-center items-center">
            {avatar && (
              <Image
                height={40}
                width={40}
                src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${avatar}`}
                alt=""
                className=""
              />
            )}
          </div>
          <input
            name="content"
            type={"text"}
            placeholder="What's in your mind"
            className="w-full p-1 focus-visible:outline-none"
          />
          <button>
            <FontAwesomeIcon
              icon={faImage}
              className="text-gray-400"
              size="lg"
            />
          </button>
        </div>
        <button
          type="submit"
          className="p-1 px-3 text-white rounded-sm bg-primary"
        >
          Post
        </button>
      </form>
    </div>
  );
}

export default Post_something;
