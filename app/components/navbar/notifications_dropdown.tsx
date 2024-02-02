"use client";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Button, ConfigProvider, Dropdown, MenuProps } from "antd";
import Link from "next/link";

import { useEffect, useState } from "react";
import Notification_card from "./notification_card";
import { Notification } from "./primary_navbar";
interface Props {
  notifications_source: Notification[];
}
function Notifications_dropdown({ notifications_source }: Props) {
  const [notifications, setNotifications] = useState(notifications_source);
  useEffect(() => {
    setNotifications(notifications_source.slice(0, 7));
  }, [notifications_source]);
  let items: MenuProps["items"] = notifications?.map((notification, index) => {
    return {
      key: notification.type + " " + index,
      label: (
        <Notification_card
          notification={notification}
          index={index}
          setNotifications={setNotifications}
          notifications={notifications}
        />
      ),
    };
  });
  notifications.length !== 0 &&
    items.push({
      key: "seeMore",
      label: (
        <div className="flex justify-end w-80">
          <Link href={"/home/notifications"} className="p-1">
            <Button type="link" size="small" className="text-gray-500 ">
              <p>View all</p>
            </Button>
          </Link>
        </div>
      ),
    });
  if (notifications.length === 0) {
    items.push({
      key: "emptyNotification",
      label: <p className="p-2 text-gray-500">No notifications</p>,
    });
  }
  return (
    <ConfigProvider
      theme={{
        components: {
          Dropdown: {
            controlItemBgHover: "#ffffff",
          },
        },
      }}
    >
      <Dropdown
        menu={{ items }}
        trigger={["click"]}
        placement={"bottomRight"}
        className="max-h[90vh] overflow-y-auto"
      >
        <Badge
          className="cursor-pointer"
          size="small"
          count={
            notifications?.filter((notification) => !notification.is_seen)
              .length
          }
        >
          <FontAwesomeIcon
            className="flex items-center gap-2 text-dark"
            icon={faBell}
          />
        </Badge>
      </Dropdown>
    </ConfigProvider>
  );
}

export default Notifications_dropdown;
