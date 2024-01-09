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
import { ConfigProvider, Dropdown, MenuProps } from "antd";
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
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemBg: "#ffffff",
          },
        },
      }}
    >
      <div className="flex items-center gap-2">
        {profile?.username && (
          <Link href={"/user/profile"} className="font-semibold ">
            {profile.username}
          </Link>
        )}
        <div className="rounded-3xl me-5 flex justify-center items-center overflow-hidden size-[30px]">
          <Image height={30} width={30} alt="avatar" src={avatar} />
        </div>
        <div className="flex items-center gap-2 me-6">
          <FontAwesomeIcon icon={faEnvelope} />
        </div>
        <Dropdown
          menu={{ items, onClick: handleFormClick }}
          trigger={["click"]}
        >
          <button>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </Dropdown>
      </div>
    </ConfigProvider>
  );
}

export default If_logged_bar;
