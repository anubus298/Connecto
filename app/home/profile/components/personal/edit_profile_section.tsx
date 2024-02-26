"use client";
import { faGear } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Link from "next/link";

function Edit_profile_section() {
  return (
    <div className="flex items-end justify-start gap-2 size-full">
      <Link href={"/home/profile/settings"} type="text">
        <FontAwesomeIcon icon={faGear} />
      </Link>
    </div>
  );
}

export default Edit_profile_section;
