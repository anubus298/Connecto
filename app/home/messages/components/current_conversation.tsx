"use client";
import SendMessageAction from "@/app/lib/functions/user/message/sendMessage";
import { Database, Tables } from "@/utils/supabase/supabase";
import {
  faExclamationCircle,
  faFaceSmile,
  faFlag,
  faSearch,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { Button, ConfigProvider, Drawer } from "antd";
import Avatar from "antd/es/avatar/avatar";
import EmojiPicker from "emoji-picker-react";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Profile } from "../../home_main";
import { Message } from "./conversation.pallete";
import His_message_pallete from "./his_message_pallete";
import My_message_pallete from "./my_message_pallete";

interface Props {
  conversation_id: string;
  my_id: string;
  user_profile: Profile;
}
function Current_conversation({ conversation_id, my_id, user_profile }: Props) {
  const BindSendMessageAction = SendMessageAction.bind(null, conversation_id);
  const [messages_status, setMessages_status] = useState<
    "insert" | "update" | "insert_start"
  >("insert");
  const [drawer_open, setDrawer_open] = useState(false);
  const conversation_messagesRef = useRef<HTMLDivElement>(null);
  const [emoji_picker_open, setEmoji_picker_open] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [fromTo, setFromTo] = useState(0);
  const [did_reach_end, setDid_reach_end] = useState(false);
  const supabase = createClientComponentClient<Database>();
  function SubmitButton() {
    return (
      <button
        className="w-[10%] bg-primary text-white rounded-r-md"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          e.currentTarget.form?.requestSubmit();
          setContent("");
          e.currentTarget.form?.reset();
        }}
      >
        Send
      </button>
    );
  }
  //track conversation scroll status
  useEffect(() => {
    const handleScroll = () => {
      if (
        conversation_messagesRef.current?.scrollTop &&
        conversation_messagesRef.current?.scrollTop < 10
      ) {
        setFromTo((prevFromTo) => prevFromTo + 15);
      }
      console.log(conversation_messagesRef.current?.scrollTop);
    };
    conversation_messagesRef.current?.addEventListener("scroll", handleScroll);
    return () => {
      conversation_messagesRef.current?.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);
  //initializing realtime listening
  useEffect(() => {
    const insertChannel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload: RealtimePostgresInsertPayload<Tables<"messages">>) => {
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
      setMessages_status("insert");
      setMessages((prevMessages) => [
        { ...payload.new, profiles: profile_data.data },
        ...prevMessages,
      ]);
    }
    return () => {
      supabase.removeChannel(insertChannel);
    };
  }, [conversation_id]);

  //function to fetch messages
  useEffect(() => {
    function getMessages(from: number, to: number) {
      fetch(
        `/api/conversation/get?id=${conversation_id}&is_ascending=0&from=${from}&to=${to}`,
        { method: "GET" }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.data.length !== 0) {
            setMessages_status("insert_start");
            setMessages((prevMessages) => [...prevMessages, ...data.data]);
          } else {
            setDid_reach_end(true);
          }
        });
    }
    if (fromTo == 0) {
      setMessages_status("insert");
    }
    if (!did_reach_end) {
      setMessages_status("insert_start");
      getMessages(fromTo, fromTo + 15);
    }
  }, [conversation_id, fromTo]);
  //making and scroll to bottom pop sound whenever a user sent a message
  useEffect(() => {
    if (conversation_messagesRef.current) {
      conversation_messagesRef.current.scrollTop =
        conversation_messagesRef.current!.scrollHeight;
      if (messages_status === "insert") {
        audioRef.current?.play();
      }
    }
  }, [messages, conversation_id]);
  useEffect(() => {
    if (conversation_messagesRef.current) {
      conversation_messagesRef.current.scrollTop =
        conversation_messagesRef.current!.scrollHeight;
    }
  }, [conversation_id]);
  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgMask: "rgba(0, 0, 0, 0)",
        },
        components: {
          Avatar: {
            containerSizeLG: 80,
            containerSize: 40,
          },
        },
      }}
    >
      <div className="relative flex flex-col justify-end col-span-12 bg-white md:col-span-8">
        <Drawer
          placement="right"
          width={500}
          closable={true}
          closeIcon={<FontAwesomeIcon icon={faX} className="text-dark" />}
          onClose={() => setDrawer_open(false)}
          open={drawer_open}
          getContainer={false}
        >
          <div className="flex items-center justify-center w-full h-full">
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col items-center">
                <Avatar
                  className=""
                  size={"large"}
                  shape="square"
                  src={
                    <Image
                      src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${user_profile.avatar_url}`}
                      height={80}
                      width={80}
                      alt={user_profile.username + " avatar"}
                    />
                  }
                />
                <p className="text-lg font-semibold">{user_profile.username}</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Link href={`/home/profile?id=${user_profile.id}`}>
                  <Button>View profile</Button>
                </Link>
                <div className="flex gap-3">
                  <Button
                    size="small"
                    danger
                    icon={<FontAwesomeIcon icon={faFlag} className="" />}
                  >
                    Report
                  </Button>
                  <Button danger type="primary" size="small">
                    Block user
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Drawer>
        <audio
          controls
          src="/sounds/happy-pop.mp3"
          className="hidden"
          ref={audioRef}
        ></audio>
        <div className="flex items-center justify-between w-full gap-5 p-3 white pe-5">
          <div className="flex items-center w-full gap-5 ">
            <Avatar
              className=""
              shape="square"
              src={
                <Image
                  src={`https://ekfltxjgxftrkugxgflm.supabase.co/storage/v1/object/public/avatars/${user_profile.avatar_url}`}
                  height={50}
                  width={50}
                  alt={user_profile.username + " avatar"}
                />
              }
            />
            <p className="text-lg font-semibold">{user_profile.username}</p>
          </div>
          <button>
            <FontAwesomeIcon icon={faSearch} className="text-lg text-dark" />
          </button>
          <button onClick={() => setDrawer_open(true)}>
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className="text-lg text-dark"
            />
          </button>
        </div>
        <div
          className="flex w-full px-1 py-3 overflow-y-scroll bg-gray-50 rounded-md h-[400px] scroll-smooth flex-col-reverse"
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
          <form
            className="relative flex items-stretch"
            action={BindSendMessageAction}
          >
            <button
              className={"w-[5%] text-2xl "}
              onClick={() => setEmoji_picker_open(true)}
            >
              <FontAwesomeIcon
                icon={faFaceSmile}
                className={drawer_open ? "text-primary" : "text-gray-300"}
              />
            </button>
            <input
              name="content"
              type={"text"}
              placeholder="chat"
              value={content}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setContent(e.target.value)
              }
              className="w-[85%] p-2 border-2 focus-visible:outline-primary"
            />
            {emoji_picker_open && (
              <div className="absolute bottom-0 bg-white rounded-md right-full">
                <EmojiPicker                  
                  searchDisabled={true}
                  skinTonesDisabled
                  lazyLoadEmojis
                  onEmojiClick={(emoji) =>
                    setContent((contentPrev) => contentPrev + emoji.emoji)
                  }
                />
                <Button
                  block
                  type="text"
                  onClick={() => setEmoji_picker_open(false)}
                >
                  Close
                </Button>
              </div>
            )}
            <SubmitButton />
          </form>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default Current_conversation;
