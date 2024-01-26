"use client";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { useMediaQuery } from "react-responsive";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";

function Edit_profile_section() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });
  return !isTabletOrMobile ? (
    <div className="flex items-end justify-start gap-2 size-full">
      <Button type="text">
        <FontAwesomeIcon icon={faGear} />
      </Button>
    </div>
  ) : (
    <></>
  );
}

export default Edit_profile_section;
