"use client";
import { useMediaQuery } from "react-responsive";
function Right_home_panel() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });
  return (
    <div
      className={
        "flex items-center justify-center col-span-4 md:col-span-2 bg-blue-500 "
      }
    >
      <p>third</p>
    </div>
  );
}

export default Right_home_panel;
