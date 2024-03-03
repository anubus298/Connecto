import React from "react";
import Left_home_panel from "../../components/left_home_panel";
import SettingsCategory from "./components/settingsCategory";

function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    page: "general" | "account" | "notificationsPreference" | "privacy";
  };
}) {
  return (
    <div className="grid grid-cols-12 col-span-12 gap-4 place-content-start">
      <Left_home_panel />
      <div className="grid grid-cols-12 col-span-12 p-3 mt-4 bg-white rounded-md dark:bg-whiteDark text-dark dark:text-white md:col-span-10 gap-x-2 place-content-start gap-y-6">
        <div className="col-span-12">
          <h1 className="mb-1 h3">Settings</h1>
          <hr></hr>
        </div>
        <SettingsCategory currentPage={params.page} />
        <div className="col-span-12 md:col-span-9">{children}</div>
      </div>
    </div>
  );
}

export default SettingsLayout;
