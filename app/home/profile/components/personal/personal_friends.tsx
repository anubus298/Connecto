"use client";

import { Avatar, Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Friend } from "../other/other_profile";

import Friends_modal from "./modal_friends";

interface Props {
  friends: Friend[] | null;
  user_id: string | null;
  count: number;
}
function Personal_friends({ friends, user_id, count }: Props) {
  const [isFriendModalOpen, setisFriendModalOpen] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });
  return !isTabletOrMobile ? (
    <div className="flex flex-col w-full p-3 bg-white rounded-md">
      <div className="flex items-center justify-between">
        <h3 className=" h3">Friends</h3>
        <p className="text-lg font-medium">{count}</p>
      </div>
      <div className="w-full h-[1px] bg-gray-200 mb-6"></div>
      {friends?.length != 0 && (
        <div className="grid w-full grid-cols-3 p-2 rounded-md gap-y-4">
          {friends &&
            friends.map((friend, index) => {
              return (
                <div
                  className="grid col-span-1 place-content-center"
                  key={index * 2 + 40000}
                >
                  <Link
                    href={`/home/profile?id=${friend.friend.id}`}
                    className="w-[90px] flex flex-col items-center bg-white rounded-t-md rounded-b-sm"
                    key={index * 122 + 123}
                  >
                    <Avatar
                      shape="square"
                      className="hover:brightness-110"
                      src={
                        <Image
                          src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${friend.friend.avatar_url}`}
                          height={90}
                          width={90}
                          alt={friend.friend.username + " avatar"}
                        />
                      }
                    />
                    <p className="max-w-full py-1 overflow-hidden text-sm font-medium text-center text-ellipsis whitespace-nowrap">
                      {friend.friend.username}
                    </p>
                  </Link>
                </div>
              );
            })}
          <div className="flex justify-end col-span-3">
            <Button type="text" onClick={() => setisFriendModalOpen(true)}>
              View All
            </Button>
            <Friends_modal
              isFriendModalOpen={isFriendModalOpen}
              setisFriendModalOpen={setisFriendModalOpen}
              user_id={user_id}
            />
          </div>
        </div>
      )}
      {friends?.length == 0 && (
        <div className="flex justify-center items-center w-full p-3 bg-white rounded-md">
          <h3 className="">Add Some Friends</h3>
        </div>
      )}
    </div>
  ) : (
    <></>
  );
}

export default Personal_friends;
