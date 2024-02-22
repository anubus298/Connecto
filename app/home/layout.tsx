import React from "react";
import Server_Navbar from "../components/navbar/server_navbar";
import BlankLogo from "../components/blankLogo";
import { table } from "console";
import Announce_card from "../components/navbar/announce_card";

function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Announce_card />
      <div className="grid grid-cols-12 col-span-12 gap-4 place-content-start">
        <Server_Navbar />
        <BlankLogo />
        <div className="container relative col-span-12 mx-auto">
          {/* <Server_floating_messages /> */}
          {children}
        </div>
      </div>
    </>
  );
}

export default HomeLayout;
