"use client";
import { Tables } from "@/utils/supabase/supabase";
import Left_home_panel from "../../components/left_home_panel";
import { Profile } from "../../home_main";
import InfiniteScroll from "react-infinite-scroll-component";

import { Button } from "antd";
import { useState } from "react";
import useFetchPage from "@/app/lib/hooks/useFetchPage";
import Notification_card from "@/app/components/navbar/notification_card";
import setNotificationAction from "@/app/lib/functions/user/notifications/setNotification";

type Notification = Tables<"notifications"> & {
  from: { avatar_url: string; username: string; id: string };
};

interface Props {
  notifications: Notification[] | null;
}
function Main_notifications({ notifications }: Props) {
  const [from, setFrom] = useState(0);
  const { loading, list, setList, hasMore } = useFetchPage<Notification>(
    "/api/profile/getNotifications",
    { id: "" },
    notifications ?? [],
    from,
    from + 10
  );
  async function makeAllRead() {
    const test = [...list];
    test.forEach((notif) => (notif.is_read = true));
    setList(test);
    await setNotificationAction("readAll", 0);
  }
  const [is_first, setis_first] = useState(true);
  return (
    <div className="grid grid-cols-12 gap-4 *:rounded-md">
      <Left_home_panel />
      <div className="col-start-3 col-end-11 p-3 bg-white">
        <h3 className="h3">Notifications</h3>
        <div className="h-[1px] bg-gray-300 w-full"></div>
        <div className="flex justify-end w-full p-1">
          <div className="">
            {list.findIndex((notif) => !notif.is_read) !== -1 && (
              <Button onClick={() => makeAllRead()}>Make all read</Button>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full gap-2 mt-2">
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
            next={() => {
              if (is_first) {
                setFrom((prev) => prev + (notifications?.length ?? 0));
                setis_first(false);
              } else {
                setFrom((prev) => prev + 10);
              }
            }}
          >
            {list &&
              list.map((notif, index) => {
                return (
                  <Notification_card
                    index={index}
                    notifications={list}
                    size={"big"}
                    notification={notif}
                    setNotifications={setList}
                    key={notif.notification_id}
                  />
                );
              })}
            {!loading && list.length === 0 && (
              <div className="flex items-center justify-center w-full h-32">
                <h6>No Notifications</h6>
              </div>
            )}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
}

export default Main_notifications;
