"use client";
import {
  faBell,
  faBookmark,
  faGear,
  faQuestionCircle,
  faRightFromBracket,
  faUserCircle,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Button, Drawer } from "antd";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import { useMediaQuery } from "react-responsive";
import Avatar_comp from "./avatar_comp";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
interface MenuItems {
  icon: React.ReactNode;
  content: string;
  href: string;
  disabled?: boolean;
}
interface Props {
  profile?: {
    avatar_url: string | null;
    username: string | null;
  };

  numberOfUnreadedMessages: number | undefined;
  my_id?: string;
  drawer_open: boolean;
  setdrawer_open: Dispatch<SetStateAction<boolean>>;
  numberOfUnreadedMessagesContext: number | undefined;
}
function Left_home_panel_drawer({
  drawer_open,
  setdrawer_open,
  profile,
  numberOfUnreadedMessagesContext,
  numberOfUnreadedMessages,
  my_id,
}: Props) {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const primarySidebarItems: MenuItems[] = [
    {
      icon: <FontAwesomeIcon size="lg" icon={faEnvelope} />,
      content: "Messages",
      href: "",
    },
    {
      icon: <FontAwesomeIcon size="lg" icon={faRightFromBracket} />,
      content: "Log out",
      href: "",
    },
  ];
  const sidebarItems: MenuItems[] = [
    {
      icon: <FontAwesomeIcon size="lg" icon={faUserCircle} />,
      content: "Profile",
      href: "/home/profile",
    },
    {
      icon: <FontAwesomeIcon size="lg" icon={faGear} />,
      content: "Settings",
      href: "/home/settings/general",
    },
    {
      icon: <FontAwesomeIcon size="lg" icon={faBell} />,
      content: "Notifications",
      href: "/home/notifications",
    },

    {
      icon: <FontAwesomeIcon size="lg" icon={faUsers} />,
      content: "Communities",
      href: "/home/communities",
      disabled: true,
    },
    {
      icon: <FontAwesomeIcon size="lg" icon={faBookmark} />,
      content: "Bookmarks",
      href: "/home/bookmarks",
    },
    {
      icon: <FontAwesomeIcon size="lg" icon={faQuestionCircle} />,
      content: "Help/Support",
      href: "",
    },
  ];
  return (
    <>
      {isTabletOrMobile && (
        <Drawer
          open={drawer_open}
          onClose={() => setdrawer_open(false)}
          className="relative glassmorphismPrimary bg-primary-dark"
        >
          <div className="flex flex-col items-center justify-between h-full px-3 py-12 font-medium text-white-light">
            <div className="flex flex-col items-center w-full overflow-visible ">
              <div className="absolute rotate-90 -top-36">
                <Image
                  height={160}
                  width={250}
                  src="/svg/logoYellow.svg"
                  alt=""
                />
              </div>
              <Link href={"/home/profile"} className="font-semibold ">
                <Avatar_comp
                  src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${profile?.avatar_url}`}
                  height={90}
                  width={90}
                  alt={"user avatar"}
                />
              </Link>
            </div>

            <Link
              href={"/home/messages"}
              className="flex items-center w-full px-6 text-white"
            >
              <Badge
                size="small"
                count={numberOfUnreadedMessagesContext}
                className=""
              >
                <FontAwesomeIcon
                  icon={faEnvelope}
                  size="lg"
                  className="flex items-center justify-start gap-4 p-4 text-xl text-white-light dark:text-white-dark hover:text-secondary"
                />
              </Badge>
              <h6 className="text-xl">Messages</h6>
            </Link>
            {sidebarItems.map((item, index) => {
              return (
                <Link
                  className="w-full px-6 "
                  href={item.href}
                  key={index + item.content + "sidebarButton"}
                  aria-disabled={item.disabled}
                >
                  <Button
                    disabled={item.disabled}
                    block
                    type="text"
                    size="large"
                    className="flex items-center justify-start gap-4 text-xl text-white-light dark:text-white-dark hover:text-secondary"
                  >
                    <div className="w-6">{item.icon}</div>
                    <h6>{item.content}</h6>
                  </Button>
                </Link>
              );
            })}
          </div>
        </Drawer>
      )}
    </>
  );
}

export default Left_home_panel_drawer;
