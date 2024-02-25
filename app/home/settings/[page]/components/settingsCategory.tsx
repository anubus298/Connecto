"use client";

import { Button } from "antd";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";

type Setting = {
  content: string;
  href: string;
  disabled?: boolean;
};
function SettingsCategory({
  currentPage,
}: {
  currentPage: "general" | "account" | "notificationsPreference" | "privacy";
}) {
  const settings: Setting[] = [
    {
      content: "General",
      href: "general",
    },
    {
      content: "Account",
      href: "account",
    },
    {
      content: "notifications Preference",
      href: "notificationsPreference",
      disabled: true,
    },
    {
      content: "Privacy",
      href: "privacy",
    },
  ];
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });
  return (
    <div className="flex flex-row col-span-12 gap-1 md:gap-4 md:flex-col md:col-span-3">
      {settings.map((setting, index) => (
        <Link
          className="w-full text-xl"
          href={"/home/settings/" + setting.href}
          key={index + setting.content}
        >
          <Button
            block={!isTabletOrMobile}
            disabled={setting.disabled}
            type={setting.href === currentPage ? "primary" : "default"}
            className="text-start"
            size={isTabletOrMobile ? "small" : "large"}
          >
            {setting.content}
          </Button>
        </Link>
      ))}
    </div>
  );
}

export default SettingsCategory;
