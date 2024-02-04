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
  return (
    <globalContext.Provider value={{ onlineUsers, setOnlineUsers }}>
      {children}
    </globalContext.Provider>
  );
}

export const globalContext = createContext<{
  onlineUsers?: FriendContext[];
  setOnlineUsers?: Dispatch<SetStateAction<FriendContext[]>>;
}>({});
