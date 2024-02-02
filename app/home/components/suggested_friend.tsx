"use client";
import Avatar_comp from "@/app/components/avatar_comp";
import sendFriendRequestAction from "@/app/lib/functions/user/friend/SendFriendRequest";
import { Avatar, Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import { Profile } from "../home_main";

interface Props {
  friend: Profile & { is_added: boolean };
  index: number;
  setFriends_state: Dispatch<
    SetStateAction<(Profile & { is_added: boolean })[]>
  >;
  friends_state: (Profile & { is_added: boolean })[];
}

function Suggested_friend({
  friend,
  index,
  setFriends_state,
  friends_state,
}: Props) {
  const [is_pending, setis_pending] = useState(false);
  return (
    <div className="flex items-center justify-between w-full gap-2">
      <Link
        href={`/home/profile?id=${friend.id}`}
        className="size-[40px] flex items-center justify-center"
      >
        <Avatar_comp
          size={"large"}
          width={40}
          height={40}
          src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${friend.avatar_url}`}
          alt={friend.id + " avatar"}
        />
      </Link>
      <Link
        href={`/home/profile?id=${friend.id}`}
        className="w-1/3 text-xs font-medium"
      >
        {friend.username}
      </Link>

      <Button
        size="small"
        className=""
        type={friend.is_added ? "primary" : "default"}
        disabled={friend.is_added}
        loading={is_pending}
        onClick={async () => {
          setis_pending(true);
          await sendFriendRequestAction(friend?.id);
          const test = [...friends_state];
          test[index] = { ...friend, is_added: true };
          setFriends_state(test);
          setis_pending(false);
        }}
      >
        {friend.is_added ? "Sent" : "Add"}
      </Button>
    </div>
  );
}

export default Suggested_friend;
