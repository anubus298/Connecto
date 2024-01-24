"use client";
import SendMessageAction from "@/app/lib/functions/user/message/sendMessage";
import { Database, Tables } from "@/utils/supabase/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import { Profile } from "../../home_main";
import { Message } from "./conversation.pallete";
import His_message_pallete from "./his_message_pallete";
import My_message_pallete from "./my_message_pallete";

interface Props {
  conversation_id: string;
  my_id: string;
}
function Current_conversation({ conversation_id, my_id }: Props) {
  const BindSendMessageAction = SendMessageAction.bind(null, conversation_id);
  const conversation_messagesRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const supabase = createClientComponentClient<Database>();
  function SubmitButton() {
    return (
      <button
        className="w-[10%] bg-primary text-white rounded-r-md"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          e.currentTarget.form?.requestSubmit();
          e.currentTarget.form?.reset();
        }}
      >
        Comment
      </button>
    );
  }
  useEffect(() => {
    const insertChannel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload: RealtimePostgresInsertPayload<Tables<"messages">>) => {
          console.log("payload", payload);
          console.log("messages", messages);
          await handleMessageInsertion(payload);
        }
      )
      .subscribe();
    async function handleMessageInsertion(
      payload: RealtimePostgresInsertPayload<Tables<"messages">>
    ) {
      const res = await fetch(`/api/profile/get?id=${payload.new.sender_id}`, {
        method: "GET",
      });
      const profile_data: { data: Profile } = await res.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        { ...payload.new, profiles: profile_data.data },
      ]);
    }
    return () => {
      supabase.removeChannel(insertChannel);
    };
  }, [conversation_id]);
  useEffect(() => {
    function getLatestMessage() {
      fetch(
        `/api/conversation/get?id=${conversation_id}&is_ascending=1&from=0&to=15`,
        { method: "GET" }
      )
        .then((res) => res.json())
        .then((data) => setMessages(data.data));
    }
    getLatestMessage();
    if (conversation_messagesRef.current?.scrollTop) {
      conversation_messagesRef.current.scrollTop =
        conversation_messagesRef.current!.scrollHeight;
      audioRef.current?.play();
    }
  }, [conversation_id]);
  useEffect(() => {
    if (conversation_messagesRef.current?.scrollTop) {
      conversation_messagesRef.current.scrollTop =
        conversation_messagesRef.current!.scrollHeight;
      audioRef.current?.play();
    }
  }, [messages, conversation_id]);
  return (
    <div className="flex flex-col justify-end col-span-8 bg-white">
      <audio
        controls
        src="/sounds/happy-pop.mp3"
        className="hidden"
        ref={audioRef}
      ></audio>

      <div
        className="flex flex-col w-full px-1 py-3 overflow-y-scroll bg-gray-100 h-[400px] scroll-smooth"
        ref={conversation_messagesRef}
      >
        {messages.map((message, index) => {
          if (message.sender_id === my_id) {
            return (
              <My_message_pallete
                message={message}
                key={"message" + conversation_id + index}
              />
            );
          } else {
            return (
              <His_message_pallete
                message={message}
                key={"message" + conversation_id + index}
              />
            );
          }
        })}
      </div>
      <div className="w-full">
        <form className="flex items-stretch" action={BindSendMessageAction}>
          <input
            name="content"
            type={"text"}
            placeholder="chat"
            className="w-[90%] p-2 border-2 focus-visible:outline-primary"
          />
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}

export default Current_conversation;
