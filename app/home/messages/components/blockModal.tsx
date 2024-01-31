"use client";

import blockUserAction from "@/app/lib/functions/user/friend/blockUser";
import { Modal } from "antd";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { Profile } from "../../home_main";

interface Props {
  isBlockUserModalOpen: boolean;
  setIsBlockUserModalOpen: Dispatch<SetStateAction<boolean>>;
  user_profile: Profile;
}
function BlockUserModal({
  isBlockUserModalOpen,
  setIsBlockUserModalOpen,
  user_profile,
}: Props) {
  const [is_deleting_post_pending, setis_deleting_post_pending] =
    useState(false);
  const router = useRouter();
  return (
    <Modal
      title={"Block " + user_profile.username}
      centered
      open={isBlockUserModalOpen}
      okButtonProps={{
        loading: is_deleting_post_pending,
      }}
      onOk={async () => {
        setis_deleting_post_pending(true);
        await blockUserAction(user_profile.id);
        router.refresh();
      }}
      onCancel={() => setIsBlockUserModalOpen(false)}
    >
      <p>Are you sure you want to block the user ?</p>
    </Modal>
  );
}

export default BlockUserModal;
