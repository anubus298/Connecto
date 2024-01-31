"use client";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { useMediaQuery } from "react-responsive";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";
import Link from "next/link";

function Edit_profile_section() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });
  return !isTabletOrMobile ? (
    <div className="flex items-end justify-start gap-2 size-full">
      <Link href={"/home/profile/settings"} type="text">
        <FontAwesomeIcon icon={faGear} />
      </Link>
    </div>
  ) : (
    <></>
  );
}

export default Edit_profile_section;
