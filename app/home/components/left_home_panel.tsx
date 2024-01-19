"use client";
import { useMediaQuery } from "react-responsive";
function Left_home_panel() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });
  return (
    <>
      {!isTabletOrMobile && (
        <div
          className={
            "flex items-center justify-center md:col-span-2 bg-blue-500"
          }
        >
          <p>third</p>
        </div>
      )}
    </>
  );
}

export default Left_home_panel;
