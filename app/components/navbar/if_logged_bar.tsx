"use client";
import {
  faBars,
  faEnvelope,
  faGear,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Dropdown, MenuProps, Modal } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import signOutAction from "@/app/lib/functions/auth/signOut";
import { useEffect, useState } from "react";
import { Notification } from "./primary_navbar";
import Notifications_dropdown from "./notifications_dropdown";
import { useMediaQuery } from "react-responsive";
import Avatar_comp from "../avatar_comp";
import { Database, Tables } from "@/utils/supabase/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";

interface Props {
  profile?: {
    avatar_url: string | null;
    username: string | null;
  };
  notifications_source: Notification[];
}

function If_logged_bar({ profile, notifications_source }: Props) {
  const router = useRouter();
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
    const insertChannel = supabase
      .channel("notification:" + profile?.username)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        async (
          payload: RealtimePostgresInsertPayload<Tables<"notifications">>
        ) => {
          console.log(payload);
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
        className="flex items-center gap-2 text-dark me-6"
      >
        <FontAwesomeIcon icon={faEnvelope} />
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
