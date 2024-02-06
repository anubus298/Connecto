"use client";
import Avatar_comp from "@/app/components/avatar_comp";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getPrettyDate } from "../../components/post";
import { Bookmark } from "./main_bookmarks";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

import unbookmarkPostAction from "@/app/lib/functions/user/post/unbookmarkPost";
interface Props {
  bookmark: Bookmark;
  my_id: string;
}
function Bookmark_pallete({ bookmark, my_id }: Props) {
  const baseUrl: string | undefined = bookmark.post_id.media_url?.slice(
    0,
    bookmark.post_id.media_url.lastIndexOf("/") + 1
  );
  const [formattedDate, setFormattedDate] = useState("");
  const [pending, setPending] = useState(false);
  useEffect(() => {
    setFormattedDate(getPrettyDate(bookmark.post_id.created_at));
  }, []);
  return (
    <article
      className="flex w-full gap-3 p-4 rounded-md bg-gray-50"
      key={bookmark.id}
    >
      <div className="flex items-center gap-2">
        <Link
          className="col-span-1"
          href={"/home/post?id=" + bookmark.post_id.id}
        >
          {bookmark.post_id.media_url ? (
            <div className=" overflow-hidden size-[130px] grid grid-cols-1 rounded-md">
              {bookmark.post_id.media_url
                .slice(
                  bookmark.post_id.media_url.lastIndexOf("/") + 1,
                  bookmark.post_id.media_url.length
                )
                .split(",")
                .slice(0, 1)
                .map((img_src, index) => {
                  return (
                    <div
                      className={"overflow-hidden col-span-1 relative"}
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
                          style={{ objectFit: "cover" }}
                          className="cursor-pointer"
                          alt={"post media number " + index}
                        />
                      )}
                    </div>
                  );
                })}
            </div>
          ) : (
            <Avatar_comp
              src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${bookmark.post_id.user_id.avatar_url}`}
              height={130}
              width={130}
              alt={bookmark.post_id.user_id.username + " avatar"}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col justify-between w-full overflow-hidden">
        <Link href={"/home/post?id=" + bookmark.post_id.id}>
          <h1 className="w-full overflow-hidden text-lg font-semibold text-ellipsis whitespace-nowrap">
            {bookmark.post_id.content && bookmark.post_id.content}
            {!bookmark.post_id.content && "Saved post"}
          </h1>
        </Link>
        <h6 className="text-xs">
          from{" "}
          <span>
            <Link
              href={
                bookmark.post_id.user_id === my_id
                  ? "/home/profile"
                  : `/home/profile?id=${bookmark.post_id.user_id.id}`
              }
              className="font-medium"
            >
              {bookmark.post_id.user_id.username}
            </Link>
          </span>{" "}
          post
        </h6>
        <div className="flex justify-end">
          <Button
            size="small"
            loading={pending}
            icon={<FontAwesomeIcon icon={faMinus} />}
            onClick={async () => {
              setPending(true);
              await unbookmarkPostAction(bookmark.post_id.id);
              setPending(false);
            }}
          >
            Unbookmark
          </Button>
        </div>
      </div>
    </article>
  );
}

export default Bookmark_pallete;
