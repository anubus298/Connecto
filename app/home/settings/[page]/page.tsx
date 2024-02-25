import { Suspense } from "react";
import Main_settings_account from "./components/main_settings_account";
import Main_settings_general from "./components/main_settings_general";
import Main_settings_notifications from "./components/main_settings_notifiactions";
import Main_settings_privacy from "./components/main_settings_privacy";
import Main_skeleton from "./components/subComponents/main_skeleton";

function Page({
  params,
}: {
  params: {
    page: "general" | "account" | "notificationsPreference" | "privacy";
  };
}) {
  switch (params.page) {
    case "account":
      return (
        <Suspense fallback={<Main_skeleton />}>
          <Main_settings_account />
        </Suspense>
      );
    case "general":
      return (
        <Suspense fallback={<Main_skeleton />}>
          <Main_settings_general />
        </Suspense>
      );

    case "notificationsPreference":
      return (
        <Suspense fallback={<Main_skeleton />}>
          <Main_settings_notifications />
        </Suspense>
      );
    case "privacy":
      return (
        <Suspense fallback={<Main_skeleton />}>
          <Main_settings_privacy />
        </Suspense>
      );
  }
}

export default Page;
