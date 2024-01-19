"use client";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";

function Edit_profile_section() {
  return (
    <div className="flex items-end justify-start gap-2 size-full">
      <Button type="primary">
        <FontAwesomeIcon icon={faGear} />
      </Button>
    </div>
  );
}

export default Edit_profile_section;
