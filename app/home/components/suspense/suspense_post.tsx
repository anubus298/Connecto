"use client";
import { Skeleton } from "antd";
import SkeletonAvatar from "antd/es/skeleton/Avatar";
import SkeletonInput from "antd/es/skeleton/Input";
function Suspense_post() {
  return (
    <div className="flex flex-col gap-3 p-3 bg-white rounded-md h-52">
      <div className="flex gap-2">
        <SkeletonAvatar shape="square" active />
        <SkeletonInput active />
      </div>
      <Skeleton active>
        <p>oooooo</p>
      </Skeleton>
    </div>
  );
}

export default Suspense_post;
