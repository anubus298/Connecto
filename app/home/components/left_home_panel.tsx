"use client";
import {
  faBell,
  faBookmark,
  faGear,
  faPager,
  faQuestionCircle,
  faUserCircle,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";
import Link from "next/link";
import React, { useRef } from "react";
import { useMediaQuery } from "react-responsive";
interface MenuItems {
  icon: React.ReactNode;
  content: string;
  href: string;
}
function Left_home_panel() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const Left_home_panelRef = useRef<HTMLDivElement>(null);
  const sidebarItems: MenuItems[] = [
    {
      icon: <FontAwesomeIcon icon={faUserCircle} />,
      content: "Account",
      href: "",
    },
    {
      icon: <FontAwesomeIcon icon={faGear} />,
      content: "Settings",
      href: "",
    },
    {
      icon: <FontAwesomeIcon icon={faBell} />,
      content: "Notifications",
      href: "",
    },
    {
      icon: <FontAwesomeIcon icon={faPager} />,
      content: "Spaces",
      href: "",
    },
    {
      icon: <FontAwesomeIcon icon={faUsers} />,
      content: "Communities",
      href: "",
    },
    {
      icon: <FontAwesomeIcon icon={faBookmark} />,
      content: "Bookmarks",
      href: "/home/bookmarks",
    },
    {
      icon: <FontAwesomeIcon icon={faQuestionCircle} />,
      content: "Help/Support",
      href: "",
    },
  ];

  return (
    <>
      {!isTabletOrMobile && (
        <div
          className="relative rounded-md md:col-span-2 bg-primary"
          ref={Left_home_panelRef}
        >
          <div
            className="sticky top-0 flex flex-col items-center justify-between h-[90dvh] px-3 py-12 font-medium text-white"
            style={{ width: Left_home_panelRef.current?.offsetWidth }}
          >
            {sidebarItems.map((item, index) => {
              return (
                <Link
                  className="w-full text-xl"
                  href={item.href}
                  key={index + item.content + "sidebarButton"}
                >
                  <Button
                    block
                    type="text"
                    size="large"
                    className="flex items-center justify-start gap-4 text-white hover:text-secondary"
                  >
                    <div className="w-6">{item.icon}</div>
                    <h6>{item.content}</h6>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default Left_home_panel;
