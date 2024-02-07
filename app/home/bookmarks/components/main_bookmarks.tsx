"use client";
import { Tables } from "@/utils/supabase/supabase";
import Left_home_panel from "../../components/left_home_panel";
import { Profile } from "../../home_main";
import InfiniteScroll from "react-infinite-scroll-component";
import Bookmark_pallete from "./bookmark";
import { Button } from "antd";
import { useState } from "react";
import useFetchPage from "@/app/lib/hooks/useFetchPage";

export type Bookmark = Tables<"bookmarks"> & {
  post_id: NonNullable<Tables<"posts">> & {
    user_id: Profile;
  };
};

interface Props {
  bookmarks: Bookmark[] | null;
  my_id?: string;
}
function Main_bookmarks({ bookmarks, my_id }: Props) {
  const [from, setFrom] = useState(0);
  const { loading, list, hasMore } = useFetchPage<Bookmark>(
    "/api/profile/getBookmarks",
    { user_id: "h" },
    bookmarks ?? [],
    from,
    from + 4
  );
  return (
    <div className="grid grid-cols-12 gap-4 *:rounded-md">
      <Left_home_panel />
      <div className="col-start-3 col-end-11 p-3 bg-white">
        <h3 className="h3">Bookmarks</h3>
        <div className="h-[1px] bg-gray-300 w-full"></div>
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
            next={() => setFrom((prev) => prev + 4)}
          >
            {my_id &&
              list &&
              list.map((bookmark) => {
                return (
                  <Bookmark_pallete
                    bookmark={bookmark}
                    my_id={my_id}
                    key={bookmark.id}
                  />
                );
              })}
            {!loading && list.length === 0 && (
              <div className="flex items-center justify-center w-full h-32">
                <h6>No bookmarks</h6>
              </div>
            )}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
}

export default Main_bookmarks;
