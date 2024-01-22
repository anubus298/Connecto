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
import { Avatar, Dropdown, MenuProps, Modal } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import signOutAction from "@/app/lib/functions/auth/signOut";
import { useState } from "react";
import { Notification } from "./primary_navbar";
import Notifications_dropdown from "./notifications_dropdown";

interface Props {
  profile?: {
    avatar_url: string | null;
    username: string | null;
  };
  notifications: Notification[];
}

function If_logged_bar({ profile, notifications }: Props) {
  const router = useRouter();
  const [isDeleteModalOpen, setisDeleteModalOpen] = useState(false);
  const [is_deleting_post_pending, setis_deleting_post_pending] =
    useState(false);
  function SubmitButton() {
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
      label: <SubmitButton />,
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
      <Notifications_dropdown notifications_source={notifications} />
      <button className="flex items-center gap-2 text-primary me-6">
        <FontAwesomeIcon icon={faEnvelope} />
      </button>
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
