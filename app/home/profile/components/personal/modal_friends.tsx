"use client";

import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConfigProvider, Modal } from "antd";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Friend } from "../other/other_profile";

import Friend_pallete from "./friend_pallete";

interface Props {
  setisFriendModalOpen: Dispatch<SetStateAction<boolean>>;
  user_id: string | null;
  isFriendModalOpen: boolean;
  is_personal?: boolean;
}
function Friends_modal({
  isFriendModalOpen,
  setisFriendModalOpen,
  user_id,
  is_personal = true,
}: Props) {
  const [From_to, setFrom_to] = useState({ from: 0, to: 15 });
  const [doneFetching, setDoneFetching] = useState(false);
  const [should_refresh, setShould_refresh] = useState(false);
  const [friends, setFriends] = useState<
    (Friend & { friendship_id: string })[]
  >([]);

  useEffect(() => {
    function getFriends(from: number, to: number) {
      setDoneFetching(false);
      fetch(
        `/api/friends/getFriends?user_id=${user_id}&from=${from}&to=${to}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setFriends(data.data);
          setDoneFetching(true);
        });
    }
    if (isFriendModalOpen) {
      getFriends(From_to.from, From_to.to);
    }
    setShould_refresh(false);
  }, [isFriendModalOpen, should_refresh]);

  return (
    <ConfigProvider theme={{}}>
      <Modal
        destroyOnClose
        width={"40vw"}
        open={isFriendModalOpen}
        centered
        onCancel={() => setisFriendModalOpen(false)}
        closeIcon={false}
        footer={null}
      >
        <div className="grid grid-cols-12 min-h-[400px] gap-y-2">
          <div className="grid grid-cols-12 col-span-12">
            <div className="col-span-12">
              <div className="flex items-center justify-between">
                <h3 className="h3">Friends List</h3>
                <button onClick={() => setisFriendModalOpen(false)}>
                  <FontAwesomeIcon icon={faX} />
                </button>
              </div>
              <div className="h-[1px] bg-gray-200 w-full mb-4"></div>
            </div>

            <div className="grid col-span-12 grid-cols-12 gap-y-2 content-start hide-scrollbar h-[300px] overflow-y-auto bg-gray-50 p-1">
              {friends &&
                friends.map((friend, index) => {
                  return (
                    <Friend_pallete
                      key={friend.friendship_id + "friendpallete"}
                      //@ts-ignore
                      friend={friend}
                      is_personal={is_personal}
                      index={index}
                      //@ts-ignore
                      friends={friends}
                      //@ts-ignore
                      setFriends={setFriends}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
}

export default Friends_modal;
