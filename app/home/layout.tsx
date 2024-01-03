import React from "react";
import Server_Navbar from "../components/navbar/server_navbar";

function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-12 col-span-12">
      <Server_Navbar />
      <div className="container mx-auto">{children}</div>
    </div>
  );
}

export default HomeLayout;
