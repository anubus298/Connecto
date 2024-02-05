"use client";
import Avatar_comp from "@/app/components/avatar_comp";
import { FriendContext, globalContext } from "@/app/lib/globalProvider";
import { ConfigProvider } from "antd";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";

interface Props {
  friends: FriendContext[];
}
function Right_home_panel({ friends: friends_source }: Props) {
  const Right_home_panelRef = useRef<HTMLDivElement>(null);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { onlineUsers, setOnlineUsers } = useContext(globalContext);
  const [friends, setFriends] = useState(
    friends_source.filter(
      (friend) =>
        onlineUsers?.findIndex(
          (onlineFriend) => onlineFriend.friend.id === friend.friend.id
        ) === -1
    )
  );
  useEffect(() => {
    setFriends(
      friends_source.filter(
        (friend) =>
          onlineUsers?.findIndex(
            (onlineFriend) => onlineFriend.friend.id === friend.friend.id
          ) === -1
      )
    );
  }, [onlineUsers]);
  return !isTabletOrMobile ? (
    <div className="relative md:col-span-2" ref={Right_home_panelRef}>
      <div
        className="sticky top-0 flex flex-col justify-start h-screen gap-2 p-2 bg-white rounded-md"
        style={{ width: Right_home_panelRef.current?.offsetWidth }}
      >
        <div className="mb-2 ">
          <h5 className="mb-1 text-xl font-semibold text-dark text-start ">
            Friends
          </h5>
          <div className="h-[.5px] w-full bg-gray-200"></div>
        </div>
        {onlineUsers?.map((user) => {
          return (
            <div
              className="flex items-center w-full justify-evenly"
              key={"online:" + user.friend.id}
            >
              <Link
                href={"/home/profile?id=" + user.friend.id}
                className="flex items-center w-2/3 gap-3"
              >
                <div className="size-[30px]">
                  <Avatar_comp
                    height={30}
                    width={30}
                    alt={user.friend.username + " avatar"}
                    src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${user.friend.avatar_url}`}
                  />
                </div>
                <h6 className="text-xs font-medium">{user.friend.username}</h6>
              </Link>
              <div className="flex justify-center w-1/3">
                <div className="bg-green-500 rounded-full size-2 "></div>
              </div>
            </div>
          );
        })}
        {onlineUsers?.length === 0 && (
          <div className="w-full h-8">
            <h6 className="text-xs text-center text-gray-300">
              no online friends
            </h6>
          </div>
        )}
        <div className="h-[.5px] w-full bg-gray-200"></div>
        {friends?.map((user) => {
          return (
            <div
              className="flex items-center w-full justify-evenly"
              key={"recent" + user.friend.id}
            >
              <Link
                href={"/home/profile?id=" + user.friend.id}
                className="flex items-center w-2/3 gap-3"
              >
                <div className="size-[30px]">
                  <Avatar_comp
                    height={30}
                    width={30}
                    alt={user.friend.username + " avatar"}
                    src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${user.friend.avatar_url}`}
                  />
                </div>
                <h6 className="text-xs font-medium">{user.friend.username}</h6>
              </Link>
              <div className="flex justify-center w-1/3">
                <div className="">
                  <p className="text-xs">{user.lastOnline}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <></>
  );
}

export default Right_home_panel;
