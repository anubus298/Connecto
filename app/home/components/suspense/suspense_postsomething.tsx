"use client";
import SkeletonAvatar from "antd/es/skeleton/Avatar";
import SkeletonButton from "antd/es/skeleton/Button";
import SkeletonInput from "antd/es/skeleton/Input";
function Suspense_postSomething() {
  return (
    <div className="flex flex-col gap-3 p-3 bg-white rounded-md h-36">
      <SkeletonInput active />
      <div className="flex gap-2">
        <SkeletonAvatar shape="square" active />
        <SkeletonInput active />
      </div>
      <div className="flex justify-end w-full">
        <SkeletonButton active />
      </div>
    </div>
  );
}

export default Suspense_postSomething;
