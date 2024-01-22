"use client";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { Profile } from "../home_main";
import Suggested_friends from "./suggested_friends";
interface Props {
  friends: Profile[];
}
function Third_grid({ friends }: Props) {
  const Third_gridRef = useRef<HTMLDivElement>(null);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });
  return (
    <>
      {!isTabletOrMobile && (
        <div className={" md:col-span-2 relative"} ref={Third_gridRef}>
          <div
            className="sticky top-0 flex flex-col items-center justify-start gap-1"
            style={{ width: Third_gridRef.current?.offsetWidth }}
          >
            <Suggested_friends friends={friends} />
            <div className="w-full p-3 bg-white rounded-md h-max">dd</div>
          </div>
        </div>
      )}
    </>
  );
}

export default Third_grid;
