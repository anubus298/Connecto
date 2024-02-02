"use client";
import Avatar_comp from "@/app/components/avatar_comp";
import sendFriendRequestAction from "@/app/lib/functions/user/friend/SendFriendRequest";
import { Button, ConfigProvider } from "antd";
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

function Suggested_friend_for_modal({
  friend,
  index,
  setFriends_state,
  friends_state,
}: Props) {
  const [is_pending, setis_pending] = useState(false);
  return (
    <ConfigProvider theme={{ components: { Avatar: { containerSizeLG: 60 } } }}>
      <div className="flex items-center justify-between w-full gap-3">
        <Link
          href={`/home/profile?id=${friend.id}`}
          className="flex items-center justify-center gap-3 text-lg font-medium text-dark"
        >
          <Avatar_comp
            size={"large"}
            width={60}
            height={60}
            src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${friend.avatar_url}`}
            alt={friend.id + " avatar"}
          />
          <p>{friend.username}</p>
        </Link>

        <Button
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
    </ConfigProvider>
  );
}

export default Suggested_friend_for_modal;
