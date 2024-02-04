"use client";

import { Button, Modal } from "antd";
import { useState } from "react";
import { Profile } from "../home_main";
import Suggested_friend from "./suggested_friend";
import Suggested_friend_for_modal from "./suggested_friend_for_modal";

interface Props {
  friends: Profile[];
}
function Suggested_friends({ friends }: Props) {
  const [is_modal_open, setis_modal_open] = useState(false);
  const [friends_state, setFriends_state] = useState(
    friends.map((friend) => {
      return {
        ...friend,
        is_added: false,
      };
    })
  );
  return (
    <div className="flex flex-col w-full p-3 bg-white rounded-md h-1/2">
      <Modal
        title={<h3 className="h3">Suggested friends</h3>}
        open={is_modal_open}
        footer={null}
        className=""
        onCancel={() => setis_modal_open(false)}
      >
        <div className="flex flex-col gap-3 p-3 overflow-y-auto hide-scrollbar h-1/2">
          {friends_state.map((friend, index) => {
            return (
              <Suggested_friend_for_modal
                index={index}
                friend={friend}
                setFriends_state={setFriends_state}
                friends_state={friends_state}
                key={index + 1 + (friend?.id ?? "null")}
              />
            );
          })}
        </div>
      </Modal>
      <h3 className="text-lg font-semibold">Suggested Friends</h3>
      <div className="bg-gray-100 h-[1px] w-full mb-4 mt-2"></div>
      <div className="flex flex-col w-full gap-2 ">
        {friends_state.slice(0, 4).map((friend, index) => {
          return (
            <Suggested_friend
              friend={friend}
              setFriends_state={setFriends_state}
              friends_state={friends_state}
              index={index}
              key={index + 1 + (friend?.id ?? "null")}
            />
          );
        })}
        {friends_state.length === 0 && (
          <div className="flex items-center justify-center w-full h-24 ">
            <h6 className="text-xs text-gray-400 ">No suggestions</h6>
          </div>
        )}
        {friends.length > 4 && (
          <div className="flex justify-end">
            <Button
              size="small"
              type="dashed"
              onClick={() => setis_modal_open(true)}
            >
              See all
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Suggested_friends;
