"use client";

import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Switch } from "antd";
import { useState } from "react";

function ThemePallete() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };
  return (
    <div className="col-span-12 px-2 p-1 mt-3 border-[1px] rounded-md">
      <div className="flex items-center justify-between">
        <h6 className="text-lg font-medium">Prefered Theme</h6>

        <Switch
          onClick={() => toggleDarkMode()}
          unCheckedChildren={<FontAwesomeIcon icon={faSun} />}
          checkedChildren={<FontAwesomeIcon icon={faMoon} />}
        />
      </div>
    </div>
  );
}

export default ThemePallete;
