"use client";

import changePrivacyAction from "@/app/lib/functions/user/settings/changePrivacy";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown } from "antd";
import { MenuProps } from "antd";
import { useState } from "react";

interface Props {
  items: MenuProps["items"];

  title: string;
  initialMenuValue: string;
  keyForAction: string;
}
function PrivacyDropdown({
  items,

  title,
  initialMenuValue: initialMenuValue_source,
  keyForAction,
}: Props) {
  const [initialMenuValue, seTinitialMenuValue] = useState<string>(
    initialMenuValue_source
  );
  async function onClick({ key }: { key: string }) {
    //@ts-ignore
    seTinitialMenuValue(items?.find((item) => item!.key === key)?.label ?? "");
    const res = await changePrivacyAction(keyForAction, key);
  }
  return (
    <div className="col-span-12 px-2 p-1 mt-3 border-[1px] rounded-md">
      <div className="flex items-center justify-between">
        <h6 className="text-lg font-semibold">{title}</h6>
        <Dropdown menu={{ items, onClick }} trigger={["click"]}>
          <Button icon={<FontAwesomeIcon icon={faChevronDown} />}>
            {initialMenuValue}
          </Button>
        </Dropdown>
      </div>
    </div>
  );
}

export default PrivacyDropdown;
