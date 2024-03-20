"use client";
import Avatar_comp from "@/app/components/avatar_comp";
import unblockUserAction from "@/app/lib/functions/user/friend/unblockUser";

import { Database } from "@/utils/supabase/supabase";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal } from "antd";
import { useState } from "react";
type Friend = {
  friend: {
    id: Database["public"]["Tables"]["profiles"]["Row"]["id"];
    avatar_url: Database["public"]["Tables"]["profiles"]["Row"]["avatar_url"];
    username: Database["public"]["Tables"]["profiles"]["Row"]["username"];
  };
};
interface Props {
  blockedUsers: Friend[];
}
function BlockList({ blockedUsers }: Props) {
  const [is_open, setis_open] = useState(false);
  return (
    <div className="col-span-12 px-2 p-1 mt-3 border-[1px] rounded-md">
      <div className="flex items-center justify-between">
        <h6 className="text-lg font-semibold">Blocked Users</h6>
        {blockedUsers.length > 0 && (
          <Button
            type="text"
            className="flex items-center gap-2"
            onClick={() => setis_open((prev) => !prev)}
          >
            {is_open ? "close list" : "view list"}
            <FontAwesomeIcon icon={is_open ? faEyeSlash : faEye} />
          </Button>
        )}
        {blockedUsers.length === 0 && <h6 className="text-sm">Empty</h6>}
      </div>
      {is_open && (
        <div className="flex flex-col w-full mt-2">
          {blockedUsers.map((user) => {
            return (
              <BlockedUserPallete
                user={user}
                key={user.friend.id + "blocked"}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function BlockedUserPallete({ user }: { user: Friend }) {
  const [modal_open, setModal_open] = useState(false);
  const [is_blocked, setis_blocked] = useState(true);

  const [is_unblocking_pending, setIs_unblocking_pending] = useState(false);
  return is_blocked ? (
    <div className="flex items-center justify-between w-full">
      <Modal
        destroyOnClose
        title={"Unblock " + user.friend.username}
        centered
        open={modal_open}
        okButtonProps={{
          loading: is_unblocking_pending,
        }}
        onOk={async () => {
          setIs_unblocking_pending(true);
          const num = await unblockUserAction(user.friend.id);
          setIs_unblocking_pending(false);
          setis_blocked(false);
        }}
        onCancel={() => setModal_open(false)}
      >
        <p>Are you sure you want to unblock the user ?</p>
      </Modal>
      <div className="flex items-center gap-2">
        <Avatar_comp
          height={25}
          alt=""
          width={25}
          src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${user.friend.avatar_url}`}
        />
        <h6 className="text-xs font-medium">{user.friend.username}</h6>
      </div>
      <Button
        type="text"
        danger
        size="small"
        onClick={() => setModal_open(true)}
      >
        Unblock
      </Button>
    </div>
  ) : (
    <></>
  );
}
export default BlockList;
