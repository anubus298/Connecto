import React from "react";
import Server_floating_messages from "../components/floating_messages/server_floating_messages";
import Server_Navbar from "../components/navbar/server_navbar";
import BlankLogo from "../components/blankLogo";

function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-12 col-span-12 gap-4 place-content-start">
      <Server_Navbar />
      <BlankLogo />
      <div className="container relative col-span-12 mx-auto">
        <Server_floating_messages />
        {children}
      </div>
    </div>
  );
}

export default HomeLayout;
