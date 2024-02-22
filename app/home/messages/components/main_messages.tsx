"use client";
import { Database, Tables } from "@/utils/supabase/supabase";
import { FriendContext, globalContext } from "@/app/lib/globalProvider";

import { faEnvelope, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { Badge, ConfigProvider, Segmented } from "antd";
import { useContext, useEffect, useState } from "react";
import { Profile } from "../../home_main";
import { Friend } from "../../profile/components/other/other_profile";

import Current_conversation from "./current_conversation";
import Avatar_comp from "@/app/components/avatar_comp";
import initialiseConversationAction from "@/app/lib/functions/user/message/initialiseConversation";
import { useMediaQuery } from "react-responsive";
import InfiniteScrollConvPallete from "./infiniteScrollConvPalletes";

interface Props {
  conversations: {
    conversation_id: string;
    user_id: Profile;
  }[];
  my_id: string;
  friends: Friend[];
  my_profile: {
    avatar_url: any;
    username: any;
  } | null;
}
function Main_messages({
  conversations: conversations_source,
  my_id,
  my_profile,
  friends: friends_source,
}: Props) {
  const supabase = createClientComponentClient<Database>();
  useEffect(() => {
    const channel = supabase
      .channel("conversations")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "conversations" },
        async (
          payload: RealtimePostgresInsertPayload<Tables<"conversations">>
        ) => {
          await handleConversationInsert(payload);
        }
      )
      .subscribe();
    async function handleConversationInsert(
      payload: RealtimePostgresInsertPayload<Tables<"conversations">>
    ) {
      let correspondent_profile_id: string;

      if (my_id === payload.new.user_id_1) {
        correspondent_profile_id = payload.new.user_id_2;
      } else {
        correspondent_profile_id = payload.new.user_id_1;
      }
      const res = await fetch(
        `/api/profile/get?id=${correspondent_profile_id}`,
        {
          method: "GET",
        }
      );
      const profile_data: { data: Profile } = await res.json();
      setConversations([
        {
          conversation_id: payload.new.conversation_id,
          user_id: profile_data.data,
        },
        ...conversations,
      ]);
    }
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const [conversations, setConversations] = useState(conversations_source);
  const { onlineUsers, setOnlineUsers } = useContext(globalContext);
  const [friends, setFriends] = useState(
    friends_source.filter(
      (friend) =>
        onlineUsers?.findIndex(
          (onlineFriend) => onlineFriend.friend.id === friend.friend.id
        ) === -1
    )
  );
  useEffect(() => {
    setFriends(
      friends_source.filter(
        (friend) =>
          onlineUsers?.findIndex(
            (onlineFriend) => onlineFriend.friend.id === friend.friend.id
          ) === -1
      )
    );
  }, [onlineUsers]);
  const [current_page, setcurrent_page] = useState<string | number>(
    "Conversations"
  );
  const [current_conversation, setcurrent_conversation] = useState<{
    id: string;
    user_profile: Profile;
  } | null>(null);
  async function handleConversationsInitializing(user: Friend) {
    const new_conversations_id = await initialiseConversationAction(
      user.friend.id
    );
    new_conversations_id &&
      setcurrent_conversation({
        id: new_conversations_id,
        //@ts-ignore
        user_profile: user.friend,
      });
  }
  const isMediumScreen = useMediaQuery({ query: "(max-width: 768px)" });
  const [current_small_page, setcurrent_small_page] = useState<
    "first" | "second" | "either"
  >(isMediumScreen ? "first" : "either");
  return (
    <ConfigProvider
      theme={{
        components: {
          Segmented: {
            itemColor: "#1d1d1b",
          },
        },
      }}
    >
      <div className="grid-cols-12 grid gap-2 *:rounded-md *:p-3">
        {(current_small_page === "first" || !isMediumScreen) && (
          <div className="flex flex-col md:min-h-[60vh] col-span-12 md:col-span-4 gap-3 bg-white">
            <h3 className="h3">Messages</h3>
            <Segmented
              onChange={(value: string | number) => setcurrent_page(value)}
              block
              options={[
                {
                  label: "conversations",
                  value: "Conversations",
                  icon: <FontAwesomeIcon icon={faEnvelope} />,
                },
                {
                  label: "groups",
                  value: "Groups",
                  disabled: true,
                  icon: <FontAwesomeIcon icon={faUserGroup} />,
                },
              ]}
              className="w-full"
            />
            {/* friends vertical swiper */}
            {current_page === "Conversations" && (
              <div className="flex w-full px-1 pt-2 overflow-x-auto rounded-md hide-scrollbar bg-gray-50">
                {onlineUsers?.map((user) => {
                  return (
                    <button
                      onClick={async () =>
                        await handleConversationsInitializing(user)
                      }
                      className="flex flex-col items-center w-20"
                      key={"onlinePallete:" + user.friend.id}
                    >
                      <div className="h-[30px] w-full flex justify-center">
                        <Badge
                          dot
                          status="success"
                          className="border-[1px] rounded-md border-[#52c41a]"
                        >
                          <Avatar_comp
                            height={30}
                            width={30}
                            alt={user.friend.username + " avatar"}
                            src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${user.friend.avatar_url}`}
                          />
                        </Badge>
                      </div>
                      <div className="flex items-center justify-center w-20 h-7">
                        <h6 className="overflow-hidden text-xs font-medium text-ellipsis whitespace-nowrap">
                          {user.friend.username}
                        </h6>
                      </div>
                    </button>
                  );
                })}
                {friends?.map((user) => {
                  return (
                    <button
                      onClick={async () =>
                        await handleConversationsInitializing(user)
                      }
                      className="flex flex-col items-center w-20"
                      key={"friendPallete:" + user.friend.id}
                    >
                      <div className="h-[30px] w-full flex justify-center">
                        <Avatar_comp
                          height={30}
                          width={30}
                          alt={user.friend.username + " avatar"}
                          src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${user.friend.avatar_url}`}
                        />
                      </div>
                      <div className="flex items-center justify-center w-20 h-7">
                        <h6 className="overflow-hidden text-xs font-medium text-ellipsis whitespace-nowrap">
                          {user.friend.username}
                        </h6>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            {/* conversations pallete */}
            {current_page === "Conversations" && (
              <InfiniteScrollConvPallete
                conversations={conversations}
                setcurrent_conversation={setcurrent_conversation}
                setcurrent_small_page={setcurrent_small_page}
              />
            )}
          </div>
        )}

        {(current_small_page === "second" || !isMediumScreen) &&
          current_conversation && (
            <Current_conversation
              setcurrent_small_page={setcurrent_small_page}
              current_small_page={current_small_page}
              my_profile={my_profile}
              key={current_conversation.id}
              user_profile={current_conversation.user_profile}
              my_id={my_id}
              conversation_id={current_conversation.id}
            />
          )}
        {(current_small_page === "second" || !isMediumScreen) &&
          !current_conversation && (
            <div className="flex items-center justify-center col-span-8 bg-white">
              <h3 className="text-2xl font-medium">Start a conversation</h3>
            </div>
          )}
      </div>
    </ConfigProvider>
  );
}

export default Main_messages;
