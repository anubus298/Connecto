"use client";
import {
  faBars,
  faEnvelope,
  faGear,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Badge, Dropdown, MenuProps, Modal } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import signOutAction from "@/app/lib/functions/auth/signOut";
import { useContext, useEffect, useState } from "react";
import { Notification } from "./primary_navbar";
import Notifications_dropdown from "./notifications_dropdown";
import { useMediaQuery } from "react-responsive";
import Avatar_comp from "../avatar_comp";
import { Database, Tables } from "@/utils/supabase/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { Friend } from "@/app/home/profile/components/other/other_profile";
import { FriendContext, globalContext } from "@/app/lib/globalProvider";

interface Props {
  profile?: {
    avatar_url: string | null;
    username: string | null;
  };
  notifications_source: Notification[];
  numberOfUnreadedMessages: number | undefined;
  my_id?: string;
  friends: Friend[];
}

function If_logged_bar({
  profile,
  notifications_source,
  my_id,
  friends,
  numberOfUnreadedMessages,
}: Props) {
  const {
    setOnlineUsers,
    numberOfUnreadedMessagesContext,
    setNumberOfUnreadedMessages,
  } = useContext(globalContext);
  const router = useRouter();
  const [Friends] = useState(friends);
  const [isDeleteModalOpen, setisDeleteModalOpen] = useState(false);
  const isMediumScreen = useMediaQuery({ query: "(max-width: 768px)" });
  const [notifications, setNotifications] = useState(notifications_source);
  const [is_deleting_post_pending, setis_deleting_post_pending] =
    useState(false);
  function LogOutButton() {
    return (
      <button className="flex items-center gap-2 text-dark">
        <FontAwesomeIcon icon={faRightFromBracket} />
        <p>Sign out</p>
      </button>
    );
  }
  const handleFormClick: MenuProps["onClick"] = async ({ key }) => {
    if (key == "4") {
      setisDeleteModalOpen(true);
    }
  };
  const items: MenuProps["items"] = [
    {
      key: "settings",
      label: (
        <div className="flex items-center gap-2 text-dark">
          <FontAwesomeIcon icon={faGear} />
          <p>Settings</p>
        </div>
      ),
    },
    {
      key: "4",
      label: <LogOutButton />,
    },
  ];
  const supabase = createClientComponentClient<Database>();
  //initializing realtime listening
  useEffect(() => {
    setNumberOfUnreadedMessages &&
      setNumberOfUnreadedMessages(numberOfUnreadedMessages ?? 0);
    const insertChannel = supabase
      .channel("notification:" + profile?.username)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        async (
          payload: RealtimePostgresInsertPayload<Tables<"notifications">>
        ) => {
          await handleNotificationInsertion(payload);
        }
      )
      .subscribe();
    async function handleNotificationInsertion(
      payload: RealtimePostgresInsertPayload<Tables<"notifications">>
    ) {
      const res = await fetch(`/api/profile/get?id=${payload.new.sender_id}`, {
        method: "GET",
      });
      const profile_data: {
        data: { avatar_url: string; username: string; id: string };
      } = await res.json();
      setNotifications((prevNotifications) => [
        {
          ...payload.new,
          from: profile_data.data,
        },
        ...prevNotifications,
      ]);
    }
    return () => {
      supabase.removeChannel(insertChannel);
    };
  }, []);
  //initializing presence

  useEffect(() => {
    const roomOne = supabase.channel("Hall");
    const getData = async () => {
      const userStatus = {
        user: my_id,
        online_at: new Date().toISOString(),
      };

      roomOne
        .on("presence", { event: "sync" }, () => {
          const uniqueUser: Set<FriendContext> = new Set();
          for (const id in roomOne.presenceState()) {
            //@ts-ignore
            let user_id = roomOne.presenceState()[id][0].user;
            //@ts-ignore
            let latestSeen = roomOne.presenceState()[id][0].online_at;
            const index = Friends.findIndex(
              (friend) => friend.friend.id === user_id
            );
            if (index !== -1) {
              uniqueUser.add({ ...Friends[index], lastOnline: latestSeen });
            }
          }
          setOnlineUsers &&
            setOnlineUsers(Array.from(uniqueUser) as FriendContext[]);
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await roomOne.track(userStatus);
          }
        });
    };

    getData();

    return () => {
      supabase.removeChannel(roomOne);
    };
  }, [friends]);
  return (
    <div className="flex items-center gap-2">
      {profile?.username && !isMediumScreen && (
        <Link href={"/home/profile"} className="font-semibold ">
          {profile.username}
        </Link>
      )}
      <Link href={"/home/profile"} className="font-semibold ">
        <Avatar_comp
          src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${profile?.avatar_url}`}
          height={30}
          width={30}
          alt={"user avatar"}
        />
      </Link>
      <Notifications_dropdown notifications_source={notifications} />
      <Link
        href={"/home/messages"}
        className="flex items-center gap-2 text-lg text-dark me-6 md:text-base"
      >
        <Badge size="small" count={numberOfUnreadedMessagesContext}>
          <FontAwesomeIcon icon={faEnvelope} />
        </Badge>
      </Link>
      <Modal
        title="Sign Out"
        centered
        open={isDeleteModalOpen}
        okButtonProps={{
          loading: is_deleting_post_pending,
        }}
        onOk={async () => {
          setis_deleting_post_pending(true);
          await signOutAction();
          router.refresh();
        }}
        onCancel={() => setisDeleteModalOpen(false)}
      >
        <p>Are you sure you want to Sign out ?</p>
      </Modal>
      <Dropdown menu={{ items, onClick: handleFormClick }} trigger={["click"]}>
        <button>
          <FontAwesomeIcon icon={faBars} className="text-dark" />
        </button>
      </Dropdown>
    </div>
  );
}

export default If_logged_bar;
