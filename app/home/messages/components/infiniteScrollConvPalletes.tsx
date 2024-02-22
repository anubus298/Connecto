"use client";

import { Button } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { Profile } from "../../home_main";
import useFetchPage from "@/app/lib/hooks/useFetchPage";
import { Dispatch, SetStateAction, useState } from "react";
import Conversation_pallete from "./conversation.pallete";
interface Props {
  conversations: {
    conversation_id: string;
    user_id: Profile;
  }[];
  setcurrent_conversation: Dispatch<
    SetStateAction<{
      id: string;
      user_profile: Profile;
    } | null>
  >;
  setcurrent_small_page: Dispatch<
    SetStateAction<"first" | "second" | "either">
  >;
}

function InfiniteScrollConvPallete({
  conversations: conversations_source,
  setcurrent_conversation,
  setcurrent_small_page,
}: Props) {
  const [from, setFrom] = useState(0);
  const { loading, list, hasMore } = useFetchPage<Conversation>(
    "/api/conversation/get",
    { user_id: "h" },
    conversations_source ?? [],
    from,
    from + 4
  );
  return (
    <InfiniteScroll
      style={{
        rowGap: "0.5rem",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
      loader={
        <div className="flex justify-center w-full">
          <Button type="text" loading className="font-medium">
            Loading
          </Button>
        </div>
      }
      hasMore={hasMore}
      dataLength={list.length}
      next={() => setFrom((prev) => prev + 4)}
    >
      {list.map((conv) => {
        return (
          <Conversation_pallete
            conv={conv}
            setcurrent_small_page={setcurrent_small_page}
            setcurrent_conversation={setcurrent_conversation}
            key={"conv_id:" + conv.conversation_id}
          />
        );
      })}
    </InfiniteScroll>
  );
}

export default InfiniteScrollConvPallete;
type Conversation = {
  conversation_id: string;
  user_id: Profile;
};
