"use client";

import acceptFriendRequestAction from "@/app/lib/functions/user/friend/acceptFriend";
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
import { Button, ConfigProvider, Dropdown, MenuProps, Modal } from "antd";
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
  const [friend_button_pending, setFriend_button_pending] = useState(false);
  const [is_my_action, setis_my_action] = useState(friendship.is_my_action);
  const [is_modal_confirm_unfriend_open, setis_modal_confirm_unfriend_open] =
    useState(false);

  async function handleFriendButtonClick() {
    if (friend_status === "none") {
      setFriend_button_pending(true);
      await sendFriendRequestAction(profile_id);
      setis_my_action(true);
      setFriend_button_pending(false);
      setFriend_status("sent");
    } else if (friend_status === "added") {
      setis_modal_confirm_unfriend_open(true);
    }
  }
  return (
    <ConfigProvider theme={{ components: { Button: { onlyIconSizeLG: 30 } } }}>
      <div className="flex items-center px-2 w-full justify-center relative mb-4">
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
            <Button
              loading={friend_button_pending}
              onClick={async () => {
                setFriend_button_pending(true);
                await acceptFriendRequestAction(friendship.id);
                setFriend_status("added");
                setFriend_button_pending(false);
                setis_my_action(true);
              }}
              size="large"
              className="bg-green-500 hover:bg-green-400 text-white hover:border-none"
            >
              Accept Request
            </Button>
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
                className="bg-primary text-white"
                size="large"
              ></Button>
            </>
          )}
          {friend_status === "none" && (
            <Button
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
            >
              Send Friend request
            </Button>
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
          }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button size="large" className=" absolute right-0">
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
        key: "1",

        label: (
          <div className="flex items-center justify-start gap-2 text-dark">
            <FontAwesomeIcon className="w-4" icon={faUserSlash} />
            <p>Unfriend</p>
          </div>
        ),
      },
      {
        key: "2",
        label: (
          <div className="flex items-center justify-start gap-2 text-dark">
            <FontAwesomeIcon className="w-4" icon={faFlag} />
            <p>Report</p>
          </div>
        ),
      },
      {
        key: "3",
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
        key: "2",
        label: (
          <div className="flex items-center justify-start gap-2 text-dark">
            <FontAwesomeIcon className="w-4" icon={faFlag} />
            <p>Report</p>
          </div>
        ),
      },
      {
        key: "3",
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
