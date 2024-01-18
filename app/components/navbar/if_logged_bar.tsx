"use client";
import {
  faBars,
  faEnvelope,
  faGear,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { Avatar, ConfigProvider, Dropdown, MenuProps } from "antd";
import Link from "next/link";
import React, { useRef } from "react";
interface Props {
  profile?: {
    avatar_url: string | null;
    username: string | null;
  };
  avatar: string;
  signOutAction: any;
}

function If_logged_bar({ avatar, profile, signOutAction }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const handleFormClick: MenuProps["onClick"] = ({ key }) => {
    if (key == "4") {
      formRef.current?.requestSubmit();
    }
  };
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className="flex items-center gap-2 text-dark">
          <FontAwesomeIcon icon={faUser} />
          <p>Profile</p>
        </div>
      ),
    },

    {
      key: "3",
      label: (
        <div className="flex items-center gap-2 text-dark">
          <FontAwesomeIcon icon={faGear} />
          <p>Settings</p>
        </div>
      ),
    },
    {
      key: "4",
      label: (
        <form
          ref={formRef}
          action={signOutAction}
          className="flex items-center gap-2 text-dark"
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
          <button className="">Sign Out</button>
        </form>
      ),
    },
  ];
  return (
    <div className="flex items-center gap-2">
      {profile?.username && (
        <Link href={"/home/profile"} className="font-semibold ">
          {profile.username}
        </Link>
      )}
      <Link href={"/home/profile"} className="font-semibold ">
        <Avatar
          shape="square"
          src={
            <Image
              src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${profile?.avatar_url}`}
              height={30}
              width={30}
              alt={"user avatar"}
            />
          }
        />
      </Link>
      <div className="flex items-center gap-2 me-6">
        <FontAwesomeIcon icon={faEnvelope} />
      </div>
      <Dropdown menu={{ items, onClick: handleFormClick }} trigger={["click"]}>
        <button>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </Dropdown>
    </div>
  );
}

export default If_logged_bar;
