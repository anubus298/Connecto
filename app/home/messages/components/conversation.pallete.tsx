"use client";
import { Tables } from "@/utils/supabase/supabase";
import {
  faBan,
  faEllipsisV,
  faFlag,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, ConfigProvider, Dropdown, MenuProps } from "antd";
import SkeletonInput from "antd/es/skeleton/Input";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Profile } from "../../home_main";
interface Props {
  conv: {
    conversation_id: string;
    user_id: Profile;
  };
  index: number;
  setcurrent_conversation: Dispatch<SetStateAction<string | null>>;
}
export type Message = NonNullable<Tables<"messages"> & { profiles: Profile }>;

function Conversation_pallete({ conv, index, setcurrent_conversation }: Props) {
  const [latest_message, setLatest_message] = useState<Message[] | null>(null);
  const [dom_loaded, setDom_loaded] = useState(false);
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className="flex items-center gap-2 text-dark">
          <FontAwesomeIcon icon={faTrash} />
          <p>Delete</p>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className="flex items-center gap-2 text-dark">
          <FontAwesomeIcon icon={faFlag} />
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
  useEffect(() => {
    function getLatestMessage() {
      fetch(
        `/api/conversation/get?id=${conv.conversation_id}&is_ascending=0&from=0&to=0`,
        { method: "GET" }
      )
        .then((res) => res.json())
        .then((data) => setLatest_message(data.data));
    }
    setDom_loaded(true);
    getLatestMessage();
  }, []);
  return (
    <ConfigProvider
      theme={{
        token: {
          controlHeightSM: 12,
        },
      }}
    >
      <div className="relative flex items-center gap-3 px-1 py-2 border-2 border-gray-100 rounded-md hover:border-gray-200">
        <button onClick={() => setcurrent_conversation(conv.conversation_id)}>
          <Avatar
            className=""
            size={"large"}
            shape="square"
            src={
              <Image
                src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${conv.user_id.avatar_url}`}
                height={42}
                width={42}
                alt={conv.user_id.username + " avatar"}
              />
            }
          />
        </button>
        <button
          className="flex flex-col items-start justify-center"
          onClick={() => setcurrent_conversation(conv.conversation_id)}
        >
          <p className="font-medium">{conv.user_id.username}</p>
          {latest_message && (
            <p className="h-5 max-w-[200px] overflow-hidden text-sm whitespace-nowrap text-ellipsis">
              {latest_message?.[0]?.content}
            </p>
          )}
          {!latest_message && (
            <SkeletonInput active size="small" className="text-sm" />
          )}
        </button>
        {dom_loaded && (
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
            placement="bottomRight"
            className="absolute bottom-0 right-0 mx-2"
          >
            <button>
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
          </Dropdown>
        )}
      </div>
    </ConfigProvider>
  );
}

export default Conversation_pallete;