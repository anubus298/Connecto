"use client";
import Avatar_comp from "@/app/components/avatar_comp";
import unfriendAction from "@/app/lib/functions/user/friend/unfriend";
import {
  faBan,
  faEllipsisV,
  faFlag,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Dropdown, MenuProps, Modal } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Friend } from "../other/other_profile";

interface Props {
  friend: Friend & { friendship_id: number };
  index: number;
  is_personal?: boolean;
  setFriends: React.Dispatch<
    React.SetStateAction<
      (Friend & {
        friendship_id: number;
      })[]
    >
  >;
  friends: (Friend & { friendship_id: number })[];
}
function Friend_pallete({
  friend,
  index,
  friends,
  setFriends,
  is_personal = true,
}: Props) {
  const [isUnfriendModalOpen, setIsUnfriendModalOpen] = useState(false);
  const [is_unfriending_pending, setIs_unfriending_pending] = useState(false);
  const handleDropDownClick: MenuProps["onClick"] = async ({ key }) => {
    if (key == "1") {
      setIsUnfriendModalOpen(true);
    }
  };
  let items: MenuProps["items"] = [
    {
      key: "1",

      label: (
        <div className="flex items-center justify-start gap-2 text-dark">
          <FontAwesomeIcon className="w-4" icon={faUserSlash} />
          <p>Unfriend</p>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className="flex items-center justify-start gap-2 text-dark">
          <FontAwesomeIcon className="w-4" icon={faFlag} />
          <p>Report</p>
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div className="flex items-center justify-start gap-2 text-red-600">
          <FontAwesomeIcon className="w-4 x" icon={faBan} />
          <p>Block</p>
        </div>
      ),
    },
  ];
  return (
    <>
      <div className="grid col-span-10" key={friend.friendship_id + "9a562wf"}>
        <div
          className="flex items-center justify-start gap-3 bg-white rounded-l-md"
          key={index * 122 + 6879}
        >
          <Link href={`/home/profile?id=${friend.friend.id}`}>
            <Avatar_comp
              size={"default"}
              className="transition hover:brightness-75"
              src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${friend.friend.avatar_url}`}
              height={88}
              width={88}
              alt={friend.friend.username + " avatar"}
            />
          </Link>

          <Link
            className="text-lg font-medium text-dark text-start"
            href={`/home/profile?id=${friend.friend.id}`}
          >
            {friend.friend.username}
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-end col-span-2 bg-white rounded-r-md">
        {is_personal && (
          <>
            {" "}
            <Modal
              title={"Unfriend"}
              centered
              open={isUnfriendModalOpen}
              okButtonProps={{
                loading: is_unfriending_pending,
              }}
              onOk={async () => {
                setIs_unfriending_pending(true);
                await unfriendAction(friend.friendship_id);
                let mimic = [...friends];
                mimic.splice(index, 1);
                setFriends(mimic);
                setIsUnfriendModalOpen(false);
                setIs_unfriending_pending(false);
              }}
              onCancel={() => setIsUnfriendModalOpen(false)}
            >
              <p>
                Are you sure you want to unfriend{" "}
                <span className="font-semibold">{friend.friend.username}</span>
              </p>
            </Modal>
            <div className="px-2">
              <Dropdown
                menu={{
                  items,
                  onClick: handleDropDownClick,
                }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <button>
                  <FontAwesomeIcon
                    icon={faEllipsisV}
                    className="text-dark"
                    size="2x"
                  />
                </button>
              </Dropdown>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Friend_pallete;
