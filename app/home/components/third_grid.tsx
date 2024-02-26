"use client";
import Image from "next/image";
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
        <div className="relative md:col-span-2" ref={Third_gridRef}>
          <div
            className="sticky top-0 flex flex-col items-center justify-start h-screen gap-2"
            style={{ width: Third_gridRef.current?.offsetWidth }}
          >
            <Suggested_friends friends={friends} />
            <div className="flex flex-col items-center w-full p-3 bg-white rounded-md select-none h-1/2">
              <Image
                src={"/svg/walk-together-2-5.svg"}
                alt="walk together"
                height={120}
                width={180}
              />
              <h6 className="text-sm font-medium text-center">
                Help us improving the app by giving feedbacks
              </h6>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Third_grid;
