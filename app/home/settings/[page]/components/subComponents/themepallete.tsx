"use client";

import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConfigProvider, Switch } from "antd";

function ThemePallete() {
  return (
    <div className="col-span-12 px-2 p-1 mt-3 border-[1px] rounded-md">
      <div className="flex items-center justify-between">
        <h6 className="text-lg font-medium">Prefered Theme</h6>

        <Switch
          checkedChildren={<FontAwesomeIcon icon={faSun} />}
          unCheckedChildren={<FontAwesomeIcon icon={faMoon} />}
        />
      </div>
    </div>
  );
}

export default ThemePallete;
