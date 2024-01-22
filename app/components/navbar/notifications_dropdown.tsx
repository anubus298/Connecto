"use client";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Badge,
  ConfigProvider,
  Dropdown,
  MenuProps,
  notification,
} from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Notification_card from "./notification_card";
import { Notification } from "./primary_navbar";
interface Props {
  notifications_source: Notification[];
}
function Notifications_dropdown({ notifications_source }: Props) {
  const [notifications, setNotifications] = useState(notifications_source);

  const items: MenuProps["items"] = notifications?.map(
    (notification, index) => {
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
    }
  );
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
      <Dropdown menu={{ items }} trigger={["click"]} placement={"bottomRight"}>
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
