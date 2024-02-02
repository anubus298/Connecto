"use client";

import { Skeleton } from "antd";

function Suspense_comments({ count }: { count: number }) {
  const countArray = new Array(count).fill(0);
  return (
    <>
      {countArray.map((i, index) => {
        return (
          <>
            <div key={index * 3 + 4879} className="col-span-1 pt-1">
              <Skeleton.Avatar
                shape="square"
                size={"small"}
                active
                className="rounded-sm "
              />
            </div>
            <div
              key={index * 3 + 489}
              className="flex flex-col col-span-10 pt-1 gap-2 h-[72px]"
            >
              <Skeleton.Input block active />
            </div>
            <div key={index * 2 + 400879} className="col-span-1"></div>
          </>
        );
      })}
    </>
  );
}

export default Suspense_comments;
