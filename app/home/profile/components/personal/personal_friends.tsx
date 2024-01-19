"use client";

import { Avatar, Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Friends } from "../main_profile";
import Friends_modal from "./modal_friends";

interface Props {
  friends: Friends[] | null;
  user_id: string | null;
  count: number;
}
function Personal_friends({ friends, user_id, count }: Props) {
  const [isFriendModalOpen, setisFriendModalOpen] = useState(false);
  return (
    <div className="flex flex-col w-full p-3 bg-white rounded-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className=" h3">Friends</h3>
        <p className="text-lg font-medium">{count}</p>
      </div>
      {friends && (
        <div className="grid w-full grid-cols-3 p-2 rounded-md gap-y-4">
          {friends.map((friend, index) => {
            return (
              <div className="grid col-span-1 place-content-center">
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
    </div>
  );
}

export default Personal_friends;
