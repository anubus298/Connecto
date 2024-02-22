"use client";

import { createContext, Dispatch, SetStateAction, useState } from "react";
import { Friend } from "../home/profile/components/other/other_profile";

export type FriendContext = Friend & { lastOnline: string };
export default function GlobalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [onlineUsers, setOnlineUsers] = useState<FriendContext[]>([]);
  const [numberOfUnreadedMessagesContext, setNumberOfUnreadedMessages] =
    useState(0);

  return (
    <globalContext.Provider
      value={{
        onlineUsers,
        setOnlineUsers,
        numberOfUnreadedMessagesContext,
        setNumberOfUnreadedMessages,
      }}
    >
      {children}
    </globalContext.Provider>
  );
}

export const globalContext = createContext<{
  onlineUsers?: FriendContext[];
  setOnlineUsers?: Dispatch<SetStateAction<FriendContext[]>>;
  numberOfUnreadedMessagesContext?: number;
  setNumberOfUnreadedMessages?: Dispatch<SetStateAction<number>>;
}>({});
