"use client";

import { Profile } from "@/app/home/home_main";
import { Friend } from "@/app/home/profile/components/other/other_profile";
import { ConfigProvider, Menu, MenuProps } from "antd";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import Avatar_comp from "../avatar_comp";
interface Props {
  conversations: {
    conversation_id: string;
    user_id: Profile;
  }[];
  my_id: string;
  friends: Friend[];
}
type MenuItem = Required<MenuProps>["items"][number];
function Main_floating_messages({ my_id, conversations, friends }: Props) {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [selected_conversation, setselected_conversation] = useState<
    | {
        conversation_id: string;
        user_id: Profile;
      }
    | undefined
  >(undefined);
  const [chatItems, setChatItems] = useState<MenuProps["items"]>([
    getItem(
      <h6 className="font-semibold">
        {selected_conversation?.user_id.username}
      </h6>,
      "chatItem " + selected_conversation?.conversation_id,
      <Avatar_comp
        src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${selected_conversation?.user_id.avatar_url}`}
        height={25}
        width={25}
        alt={selected_conversation?.user_id.username + " avatar"}
      />
    ),
  ]);
  if (!isTabletOrMobile) {
    let items: MenuProps["items"] = [];
    if (conversations.length > 0) {
      items = [
        getItem(
          <h6 className="font-semibold">Messages</h6>,
          "messages",
          undefined,
          conversations.map((conv) => {
            return getItem(
              <button className="flex items-center justify-start w-full gap-4">
                <p className="font-semibold">{conv.user_id.username}</p>
              </button>,
              "conversation " + conv.conversation_id,
              <Avatar_comp
                src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${conv.user_id.avatar_url}`}
                height={42}
                width={42}
                alt={conv.user_id.username + " avatar"}
              />
            );
          })
        ),
      ];
    } else {
      items = [
        getItem(
          <h6 className="font-semibold">Messages</h6>,
          "messages",
          undefined,
          [getItem(<p>Add friends to chat</p>, "addFriend")]
        ),
      ];
    }

    const onClick: MenuProps["onClick"] = (e) => {
      setselected_conversation(
        conversations.find(
          (conv) => (conv.conversation_id = e.key.split(" ")[1])
        )
      );
    };
    return (
      <ConfigProvider
        theme={{
          components: { Menu: { itemHeight: 35, itemPaddingInline: 5 } },
          token: {},
        }}
      >
        <div className="fixed bottom-0 z-20 flex items-center justify-center rounded-t-md right-10">
          <Menu
            selectable={false}
            onClick={onClick}
            style={{ width: 256 }}
            mode="inline"
            items={items}
          />
        </div>
        {selected_conversation && (
          <div className="fixed bottom-0 z-20 flex items-center justify-center rounded-t-md right-80">
            <Menu
              selectable={false}
              style={{ width: 256 }}
              mode="inline"
              items={chatItems}
            />
          </div>
        )}
      </ConfigProvider>
    );
  } else {
    return <></>;
  }
}

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}
export default Main_floating_messages;
