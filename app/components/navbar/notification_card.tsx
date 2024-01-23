"use client";
import setNotificationAction from "@/app/lib/functions/user/notifications/setNotification";
import { Avatar } from "antd";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Notification } from "./primary_navbar";
interface Props {
  notification: Notification;
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
  notifications: Notification[];
  index: number;
}
function Notification_card({
  notification,
  setNotifications,
  notifications,
  index,
}: Props) {
  useEffect(() => {
    async function SeeNotification() {
      await setNotificationAction("seen", notification.notification_id);
      const test = [...notifications];
      test[index].is_seen = true;
      setNotifications(test);
    }
    SeeNotification();
  }, []);
  return (
    <div
      className={
        "flex p-2 w-80 h-16 " + (!notification.is_read && "bg-gray-50")
      }
    >
      <div className="flex items-start w-full gap-2">
        <Link
          className="col-span-1 size-[30px]"
          href={`/home/profile?id=${notification.from.id}`}
        >
          <Avatar
            className=""
            shape="square"
            src={
              <Image
                src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${notification.from.avatar_url}`}
                height={30}
                width={30}
                alt={notification.from.username + " avatar"}
              />
            }
          />
        </Link>
        {decide_notifications_text(notification)}
      </div>
    </div>
  );
}
function decide_notifications_text(notification: Notification) {
  if (notification.type == "friend request") {
    return (
      <Link
        href={`/home/profile?id=${notification.sender_id}`}
        className={"text-dark h-full w-full p-1 "}
      >
        <span className="overflow-hidden font-medium max-w-3">
          {notification.from.username}{" "}
        </span>
        sent you a friend request.
      </Link>
    );
  } else if (notification.type == "share") {
    return (
      <Link
        href={`/home/post?id=${notification.content_post_id}`}
        className={"text-dark h-full w-full p-1 "}
      >
        <span className="overflow-hidden font-medium max-w-3">
          {notification.from.username}{" "}
        </span>
        shared your post
      </Link>
    );
  }
}

export default Notification_card;
