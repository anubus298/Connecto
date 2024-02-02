"use client";
import { Database, Tables } from "@/utils/supabase/supabase";
import { faEnvelope, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { ConfigProvider, Segmented } from "antd";
import { useEffect, useState } from "react";
import { Profile } from "../../home_main";
import { Friend } from "../../profile/components/other/other_profile";
import Conversation_pallete from "./conversation.pallete";
import Current_conversation from "./current_conversation";

interface Props {
  conversations: {
    conversation_id: string;
    user_id: Profile;
  }[];
  my_id: string;
  friends: Friend[];
}
function Main_messages({ conversations: conversations_source, my_id }: Props) {
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
  const [current_page, setcurrent_page] = useState<string | number>(
    "Conversations"
  );
  const [current_conversation, setcurrent_conversation] = useState<{
    id: string;
    user_profile: Profile;
  } | null>(null);
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
        <div className="flex flex-col min-h-[60vh] col-span-12 md:col-span-4 gap-3 bg-white">
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
          {current_page === "Conversations" &&
            conversations.map((conv, index) => {
              return (
                <Conversation_pallete
                  conv={conv}
                  index={index}
                  setcurrent_conversation={setcurrent_conversation}
                  key={conv.conversation_id + index + 1}
                />
              );
            })}
        </div>

        {current_conversation && (
          <Current_conversation
            key={current_conversation.id}
            user_profile={current_conversation.user_profile}
            my_id={my_id}
            conversation_id={current_conversation.id}
          />
        )}
        {!current_conversation && (
          <div className="flex items-center justify-center col-span-8 bg-white">
            <h3 className="text-2xl h3">Start a conversation</h3>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
}

export default Main_messages;
