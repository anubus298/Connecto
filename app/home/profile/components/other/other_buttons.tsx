"use client";

import blockUserAction from "@/app/lib/functions/user/friend/blockUser";
import handleFriendRequestAction from "@/app/lib/functions/user/friend/handleFriendRequestAction";
import sendFriendRequestAction from "@/app/lib/functions/user/friend/SendFriendRequest";
import unfriendAction from "@/app/lib/functions/user/friend/unfriend";
import {
  faBan,
  faEllipsisH,
  faFlag,
  faMessage,
  faUserCheck,
  faUserClock,
  faUserPlus,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ConfigProvider, Dropdown, Modal } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
interface Props {
  friendship: {
    id?: number;
    status: "added" | "sent" | "none";
    is_my_action: boolean;
  };
  profile_id: string;
}
function Other_buttons({ friendship, profile_id }: Props) {
  const [friend_status, setFriend_status] = useState(friendship.status);
  const router = useRouter();
  const [friend_button_pending, setFriend_button_pending] = useState(false);
  const [is_my_action, setis_my_action] = useState(friendship.is_my_action);
  const [is_modal_confirm_unfriend_open, setis_modal_confirm_unfriend_open] =
    useState(false);

  async function handleDropDownClick({ key }: { key: string }) {
    if (key === "unfriend") {
      await unfriendAction(friendship.id);
      setFriend_status("none");
    } else if (key === "block") {
      await blockUserAction(profile_id);
      router.push("/home");
    }
  }
  return (
    <ConfigProvider theme={{ components: { Button: { onlyIconSizeLG: 30 } } }}>
      <div className="relative flex items-center justify-center w-full px-2 mb-4">
        <div className="flex items-center gap-2">
          {is_my_action && friend_status === "sent" && (
            <Button
              disabled
              type="primary"
              size="large"
              icon={decide_user_icon(friend_status)}
            >
              Sent
            </Button>
          )}
          {!is_my_action && friend_status === "sent" && (
            <>
              <Button
                loading={friend_button_pending}
                onClick={async () => {
                  setFriend_button_pending(true);
                  await handleFriendRequestAction("accepted", friendship.id);
                  setFriend_status("added");
                  setFriend_button_pending(false);
                  setis_my_action(true);
                }}
                size="large"
                className="text-white bg-green-500 hover:bg-green-400 hover:border-none"
              >
                Accept Request
              </Button>
              <Button
                loading={friend_button_pending}
                onClick={async () => {
                  setFriend_button_pending(true);
                  await handleFriendRequestAction("rejected", friendship.id);
                  setFriend_status("added");
                  setFriend_button_pending(false);
                  setis_my_action(true);
                }}
                size="large"
                className="text-white bg-red-600 hover:bg-red-400 hover:border-none"
              >
                Reject
              </Button>
            </>
          )}
          {friend_status === "added" && (
            <>
              <Modal
                centered
                okButtonProps={{
                  loading: friend_button_pending,
                }}
                onOk={async () => {
                  setFriend_button_pending(true);
                  await unfriendAction(friendship.id);
                  setFriend_button_pending(false);
                  setFriend_status("none");
                  setis_my_action(true);
                }}
                title={"unfriend"}
                open={is_modal_confirm_unfriend_open}
                onCancel={() => setis_modal_confirm_unfriend_open(false)}
              >
                <p>Do you want to unfriend the user ?</p>
              </Modal>
              <Button
                onClick={() => setis_modal_confirm_unfriend_open(true)}
                icon={decide_user_icon(friend_status)}
                className="text-white bg-primary"
                size="large"
              ></Button>
            </>
          )}
          {friend_status === "none" && (
            <Button
              icon={<FontAwesomeIcon icon={faUserPlus} />}
              loading={friend_button_pending}
              onClick={async () => {
                setFriend_button_pending(true);
                await sendFriendRequestAction(profile_id);
                setFriend_status("sent");
                setis_my_action(true);
                setFriend_button_pending(false);
              }}
              size="large"
              type="primary"
            ></Button>
          )}
          {friend_status === "added" && (
            <Button
              type="primary"
              size="large"
              icon={<FontAwesomeIcon icon={faMessage} />}
            >
              Message
            </Button>
          )}
        </div>
        <Dropdown
          menu={{
            items: getItems(friend_status),
            onClick: handleDropDownClick,
          }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button size="large" className="absolute right-0 ">
            <FontAwesomeIcon icon={faEllipsisH} className="text-dark" />
          </Button>
        </Dropdown>
      </div>
    </ConfigProvider>
  );
}
function decide_user_icon(status: "added" | "sent" | "none") {
  if (status === "added") {
    return <FontAwesomeIcon icon={faUserCheck} />;
  } else if (status === "sent") {
    return <FontAwesomeIcon icon={faUserClock} />;
  } else {
    return <FontAwesomeIcon icon={faUserPlus} />;
  }
}

function getItems(status: "sent" | "none" | "added") {
  if (status === "added") {
    return [
      {
        key: "unfriend",

        label: (
          <div className="flex items-center justify-start gap-2 text-dark">
            <FontAwesomeIcon className="w-4" icon={faUserSlash} />
            <p>Unfriend</p>
          </div>
        ),
      },
      {
        key: "report",
        label: (
          <div className="flex items-center justify-start gap-2 text-dark">
            <FontAwesomeIcon className="w-4" icon={faFlag} />
            <p>Report</p>
          </div>
        ),
      },
      {
        key: "block",
        label: (
          <div className="flex items-center justify-start gap-2 text-red-600">
            <FontAwesomeIcon className="w-4 x" icon={faBan} />
            <p>Block</p>
          </div>
        ),
      },
    ];
  } else {
    return [
      {
        key: "report",
        label: (
          <div className="flex items-center justify-start gap-2 text-dark">
            <FontAwesomeIcon className="w-4" icon={faFlag} />
            <p>Report</p>
          </div>
        ),
      },
      {
        key: "block",
        label: (
          <div className="flex items-center justify-start gap-2 text-red-600">
            <FontAwesomeIcon className="w-4 x" icon={faBan} />
            <p>Block</p>
          </div>
        ),
      },
    ];
  }
}

export default Other_buttons;
