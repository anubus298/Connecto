"use client";
import { getPrettyDate } from "@/app/home/components/post";
import setNotificationAction from "@/app/lib/functions/user/notifications/setNotification";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect } from "react";
import Avatar_comp from "../avatar_comp";
import { Notification } from "./primary_navbar";
interface Props {
  notification: Notification;
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
  notifications: Notification[];
  index: number;
  size?: "big" | "default";
}
function Notification_card({
  notification,
  setNotifications,
  notifications,
  index,
  size = "default",
}: Props) {
  async function readNotification() {
    await setNotificationAction("read", notification.notification_id);
    const test = [...notifications];
    test[index].is_read = true;
    setNotifications(test);
  }
  function decide_notifications_text(notification: Notification) {
    if (notification.type == "friend request") {
      return (
        <Link
          onClick={async () => await readNotification()}
          href={`/home/profile?id=${notification.sender_id}`}
          className={"text-gray-700 h-full w-full p-1 "}
        >
          <span className="overflow-hidden font-medium text-dark max-w-3">
            {notification.from.username}{" "}
          </span>
          sent you a friend request.
        </Link>
      );
    } else if (notification.type == "share") {
      return (
        <Link
          onClick={async () => await readNotification()}
          href={`/home/post?id=${notification.content_post_id}`}
          className={"text-gray-700 h-full w-full p-1 "}
        >
          <span className="overflow-hidden font-medium text-dark max-w-3">
            {notification.from.username}{" "}
          </span>
          shared your post
        </Link>
      );
    } else if (notification.type == "friend request accepted") {
      return (
        <Link
          onClick={async () => await readNotification()}
          href={`/home/profile?id=${notification.sender_id}`}
          className={"text-gray-700 h-full w-full p-1 "}
        >
          <span className="overflow-hidden font-medium text-dark max-w-3">
            {notification.from.username}{" "}
          </span>
          accepted your friend request
        </Link>
      );
    } else if (notification.type == "post like") {
      return (
        <Link
          onClick={async () => await readNotification()}
          href={`/home/post?id=${notification.content_post_id}`}
          className={"text-gray-700 h-full w-full p-1 "}
        >
          <span className="overflow-hidden font-medium text-dark max-w-3">
            {notification.from.username}{" "}
          </span>
          liked your post
        </Link>
      );
    } else if (notification.type == "post likes") {
      return (
        <Link
          onClick={async () => await readNotification()}
          href={`/home/post?id=${notification.content_post_id}`}
          className={"text-gray-700 h-full w-full p-1 "}
        >
          <span className="overflow-hidden font-medium text-dark max-w-3">
            {notification.from.username}{" "}
          </span>
          and {notification.likes_count} others liked your post
        </Link>
      );
    }
  }
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
        "flex p-1 relative border-b-[1px] " +
        (!notification.is_read && "bg-gray-50 ") +
        (size === "default" ? "w-full h-16 " : "w-full h-20 ")
      }
    >
      <div
        className={"flex items-start w-full gap-x-2 " + (size === "big" && "")}
      >
        <Link
          className={" " + (size === "default" ? "size-[40px]" : "size-[60px]")}
          href={`/home/profile?id=${notification.from.id}`}
        >
          <Avatar_comp
            src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${notification.from.avatar_url}`}
            height={size === "default" ? 40 : 60}
            width={size === "default" ? 40 : 60}
            alt={notification.from.username + " avatar"}
          />
        </Link>

        <time
          dateTime={notification.created_at}
          className="absolute bottom-0 text-xs text-gray-700 left-1 text-end"
        >
          {getPrettyDate(notification.created_at)}
        </time>

        {decide_notifications_text(notification)}
      </div>
    </div>
  );
}

export default Notification_card;
