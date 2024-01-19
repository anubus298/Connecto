"use client";

import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ConfigProvider, Modal } from "antd";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Friends } from "../main_profile";
import Friend_pallete from "./friend_pallete";

interface Props {
  setisFriendModalOpen: Dispatch<SetStateAction<boolean>>;
  user_id: string | null;
  isFriendModalOpen: boolean;
}
function Friends_modal({
  isFriendModalOpen,
  setisFriendModalOpen,
  user_id,
}: Props) {
  const [From_to, setFrom_to] = useState({ from: 0, to: 15 });
  const [doneFetching, setDoneFetching] = useState(false);
  const [should_refresh, setShould_refresh] = useState(false);
  const [friends, setFriends] = useState<
    (Friends & { friendship_id: string })[]
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
                <Button
                  type="dashed"
                  onClick={() => setisFriendModalOpen(false)}
                >
                  <FontAwesomeIcon icon={faX} />
                </Button>
              </div>
              <div className="h-[1px] bg-gray-200 w-full mb-4"></div>
            </div>

            <div className="grid col-span-12 grid-cols-12 gap-y-2 content-start hide-scrollbar h-[300px] overflow-y-auto bg-gray-50 p-1">
              {friends &&
                friends.map((friend, index) => {
                  return (
                    <Friend_pallete
                      friend={friend}
                      index={index}
                      friends={friends}
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
